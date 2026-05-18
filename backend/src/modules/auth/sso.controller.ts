import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import type { Request, Response } from 'express';
import User from '../../database/models/User';
import { reply } from '../../shared/utils/apiResponse';
import { issueTokenPair } from '../../shared/utils/tokenPair';
import { getClientIp } from '../../shared/utils/requestMeta';
import { appendAuditLog } from '../../shared/utils/auditLog';
import { normalizeEmail } from '../../shared/utils/normalizeEmail';
import { findUserByEmail } from '../../shared/utils/findUserByEmail';

const STATE_COOKIE = 'google_oauth_state';
const STATE_MAX_AGE_MS = 10 * 60 * 1000;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function getGoogleOAuthClient(): OAuth2Client | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const base = (process.env.API_PUBLIC_URL || `http://127.0.0.1:${process.env.PORT || 5000}`).replace(
    /\/$/,
    ''
  );
  const redirectUri = `${base}/api/auth/sso/google/callback`;
  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

function frontendSuccessUrl(accessToken: string): string {
  const clientBase = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
  const path = (process.env.SSO_SUCCESS_PATH || '/sso-callback').startsWith('/')
    ? (process.env.SSO_SUCCESS_PATH || '/sso-callback')
    : `/${process.env.SSO_SUCCESS_PATH || 'sso-callback'}`;
  const url = new URL(path, `${clientBase}/`);
  /** Access JWT only — use `Accept: application/json` on the callback for `refreshToken`. */
  url.searchParams.set('token', accessToken);
  return url.toString();
}

/**
 * Starts Google OAuth: redirects browser to Google's consent screen.
 */
export const googleSsoStart = (req: Request, res: Response): Response | void => {
  const client = getGoogleOAuthClient();
  if (!client) {
    return reply(res, 503, 'Google SSO is not configured (set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)');
  }
  const state = crypto.randomBytes(24).toString('hex');
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: STATE_MAX_AGE_MS,
    path: '/',
  });
  const authorizeUrl = client.generateAuthUrl({
    access_type: 'online',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  });
  return res.redirect(302, authorizeUrl);
};

/**
 * OAuth redirect_uri target: exchanges code, upserts user, redirects to frontend with JWT.
 */
export const googleSsoCallback = async (req: Request, res: Response): Promise<Response | void> => {
  const client = getGoogleOAuthClient();
  if (!client) {
    return reply(res, 503, 'Google SSO is not configured');
  }

  const code = typeof req.query.code === 'string' ? req.query.code : '';
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  const cookieState = req.cookies?.[STATE_COOKIE] as string | undefined;

  res.clearCookie(STATE_COOKIE, { path: '/' });

  if (req.query.error) {
    const desc = typeof req.query.error_description === 'string' ? req.query.error_description : '';
    return reply(res, 400, `Google OAuth error: ${String(req.query.error)}${desc ? ` — ${desc}` : ''}`);
  }
  if (!code || !state || !cookieState || state !== cookieState) {
    return reply(res, 400, 'Invalid or missing OAuth state');
  }

  try {
    const { tokens } = await client.getToken({ code });
    const idToken = tokens.id_token;
    if (!idToken) {
      return reply(res, 400, 'No ID token from Google');
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub) {
      return reply(res, 400, 'Invalid Google account payload');
    }
    if (payload.email_verified !== true || !payload.email) {
      return reply(res, 403, 'Google email must be verified');
    }

    const email = normalizeEmail(payload.email);
    if (!email) {
      return reply(res, 400, 'Invalid email from Google');
    }
    const name = payload.name?.trim() || email.split('@')[0] || 'User';
    const googleSub = payload.sub;

    let user = await User.findOne({ googleSub });
    if (!user) {
      const existing = await findUserByEmail(email);
      if (existing) {
        existing.googleSub = googleSub;
        await existing.save();
        user = existing;
      } else {
        user = await User.create({ name, email, googleSub });
      }
    }

    let data: Awaited<ReturnType<typeof issueTokenPair>>;
    try {
      data = await issueTokenPair(user._id, {
        deviceName: 'Google SSO',
        ipAddress: getClientIp(req),
      });
    } catch {
      return reply(res, 500, 'Server configuration error');
    }

    const wantsJson =
      (req.headers.accept && req.headers.accept.includes('application/json')) ||
      req.query.format === 'json';
    appendAuditLog({
      action: 'LOGIN_SSO_SUCCESS',
      req,
      userId: user._id,
    });

    if (wantsJson) {
      return reply(res, 200, 'Signed in with Google', data);
    }

    return res.redirect(302, frontendSuccessUrl(data.accessToken));
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};
