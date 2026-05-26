import type { Request, Response } from 'express';
import User from '../users/user.model';
import { normalizeEmail, findUserByEmail } from '../users/user.service';
import { hashPassword, comparePassword } from '../../utils/bcrypt';
import { reply } from '../../utils/response';
import {
  issueTokenPair,
  listSessionsForUser,
  revokeAllRefreshTokensForUser,
  revokeRefreshToken,
  rotateRefreshToken,
  getClientIp,
  resolveDeviceName,
  createPlainResetToken,
  hashToken,
  appendAuditLog,
} from './auth.service';
import {
  accountLockDurationMs,
  clearExpiredLock,
  isAccountLocked,
  maxLoginAttemptsBeforeLock,
} from './auth.validation';
import AuditLog from './audit.model';
import type {
  ForgotPasswordBodyDto,
  LoginBodyDto,
  LogoutBodyDto,
  RefreshTokenBodyDto,
  ResetPasswordBodyDto,
} from './auth.types';
import type { RegisterBodyDto, RegisteredUserDto } from '../users/user.types';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export const register = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { name, email: rawEmail, password } = req.body as RegisterBodyDto;

    const email = normalizeEmail(rawEmail);

    let user = await findUserByEmail(rawEmail);
    if (user) {
      return reply(res, 409, 'User already exists');
    }

    const hashedPassword = await hashPassword(password ?? '');

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const userPayload: RegisteredUserDto = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
    return reply(res, 201, 'User created successfully', { user: userPayload });
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};

export const refresh = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { refreshToken } = req.body as RefreshTokenBodyDto;
    if (!refreshToken || typeof refreshToken !== 'string') {
      return reply(res, 422, 'refreshToken is required');
    }
    const sessionMeta = {
      deviceName: resolveDeviceName(req, (req.body as RefreshTokenBodyDto).deviceName),
      ipAddress: getClientIp(req),
    };
    const data = await rotateRefreshToken(refreshToken, sessionMeta);
    return reply(res, 200, 'Token refreshed', data);
  } catch {
    return reply(res, 401, 'Invalid or expired refresh token');
  }
};

export const listSessions = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const sessions = await listSessionsForUser(req.authUserId!);
    return reply(res, 200, 'OK', { sessions });
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};

export const logoutAllDevices = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    await revokeAllRefreshTokensForUser(req.authUserId!);
    return reply(res, 200, 'Signed out from all devices');
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};

export const logout = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { refreshToken } = req.body as LogoutBodyDto;
    if (!refreshToken || typeof refreshToken !== 'string') {
      return reply(res, 422, 'refreshToken is required');
    }
    await revokeRefreshToken(refreshToken);
    return reply(res, 200, 'Signed out');
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};

export const login = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email: rawEmail, password } = req.body as LoginBodyDto;

    const user = await findUserByEmail(rawEmail);
    if (!user) {
      appendAuditLog({
        action: 'LOGIN_FAILURE',
        req,
        emailNormalized: normalizeEmail(rawEmail) || undefined,
        metadata: { reason: 'unknown_user' },
      });
      return reply(res, 401, 'Invalid credentials');
    }

    if (clearExpiredLock(user)) {
      await user.save();
    }

    if (isAccountLocked(user) && user.lockUntil) {
      appendAuditLog({
        action: 'LOGIN_LOCKED',
        req,
        userId: user._id,
        metadata: { lockUntil: user.lockUntil.toISOString() },
      });
      return reply(res, 423, 'Account temporarily locked due to repeated failed sign-in attempts.', {
        lockUntil: user.lockUntil.toISOString(),
      });
    }

    if (!user.password) {
      appendAuditLog({
        action: 'LOGIN_FAILURE',
        req,
        userId: user._id,
        metadata: { reason: 'google_only' },
      });
      return reply(res, 401, 'This account uses Google sign-in');
    }

    const isMatch = await comparePassword(password ?? '', user.password);
    if (!isMatch) {
      const max = maxLoginAttemptsBeforeLock();
      user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
      let accountLocked = false;
      if (user.failedLoginAttempts >= max) {
        user.lockUntil = new Date(Date.now() + accountLockDurationMs());
        user.failedLoginAttempts = 0;
        accountLocked = true;
      }
      await user.save();
      appendAuditLog({
        action: 'LOGIN_FAILURE',
        req,
        userId: user._id,
        metadata: { reason: 'bad_password', accountLocked },
      });
      return reply(res, 401, 'Invalid credentials');
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    let data: Awaited<ReturnType<typeof issueTokenPair>>;
    try {
      data = await issueTokenPair(user._id, {
        deviceName: resolveDeviceName(req, (req.body as LoginBodyDto).deviceName),
        ipAddress: getClientIp(req),
      });
    } catch {
      return reply(res, 500, 'Server configuration error');
    }
    appendAuditLog({ action: 'LOGIN_SUCCESS', req, userId: user._id });
    return reply(res, 200, 'Signed in successfully', data);
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};

const FORGOT_PASSWORD_MESSAGE =
  "If an account exists for that email, we've sent reset instructions.";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export const forgotPassword = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const email = normalizeEmail((req.body as ForgotPasswordBodyDto).email);
    if (!email) {
      return reply(res, 422, 'Valid email is required');
    }

    const user = await findUserByEmail((req.body as ForgotPasswordBodyDto).email);
    if (!user) {
      return reply(res, 200, FORGOT_PASSWORD_MESSAGE);
    }

    const plainToken = createPlainResetToken();
    user.passwordResetToken = hashToken(plainToken);
    user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const base = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
    const resetUrl = `${base}/reset-password?token=${plainToken}`;
    console.info('[password-reset]', resetUrl);

    return reply(res, 200, FORGOT_PASSWORD_MESSAGE);
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { token, password } = req.body as ResetPasswordBodyDto;
    if (!token || typeof token !== 'string') {
      return reply(res, 422, 'Reset token is required');
    }
    if (!password || typeof password !== 'string') {
      return reply(res, 422, 'New password is required');
    }
    if (password.length < 8) {
      return reply(res, 422, 'Password must be at least 8 characters');
    }

    const hashedToken = hashToken(token.trim());
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
      return reply(res, 400, 'Invalid or expired reset token');
    }

    user.password = await hashPassword(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    await revokeAllRefreshTokensForUser(user._id);

    return reply(res, 200, 'Password has been reset successfully');
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};

export const listMyAuditLogs = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const raw = Number(req.query.limit);
    const limit = Number.isFinite(raw) && raw > 0 ? Math.min(Math.floor(raw), 100) : 50;

    type AuditActionType = 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGIN_LOCKED' | 'LOGIN_SSO_SUCCESS';
    const AUDIT_ACTIONS: AuditActionType[] = [
      'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGIN_LOCKED', 'LOGIN_SSO_SUCCESS',
    ];

    function parseActionFilter(val: unknown): AuditActionType | undefined {
      if (typeof val !== 'string' || !val.trim()) return undefined;
      const action = val.trim() as AuditActionType;
      return AUDIT_ACTIONS.includes(action) ? action : undefined;
    }

    const action = parseActionFilter(req.query.action);
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;

    const filter: Record<string, unknown> = { user: String(req.authUserId) };
    if (action) filter.action = action;

    const q = search?.trim();
    if (q) {
      const pattern = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ ipAddress: pattern }, { action: pattern }, { userAgent: pattern }];
    }

    const rows = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();

    const logs = rows.map((row) => ({
      id: String(row._id),
      action: row.action,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      metadata: row.metadata ?? undefined,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : undefined,
    }));

    return reply(res, 200, 'OK', { logs });
  } catch (error) {
    return reply(res, 500, errorMessage(error));
  }
};
