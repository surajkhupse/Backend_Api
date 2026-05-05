import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  listSessions,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
} from './auth.controller';
import { googleSsoCallback, googleSsoStart } from './sso.controller';
import { listMyAuditLogs } from './audit.controller';
import { authenticate } from '../../shared/middleware/authenticate';

const router = express.Router();

/**
 * @openapi
 * /api/auth/sso/google:
 *   get:
 *     tags: [Accounts]
 *     summary: Start Google SSO (browser redirect)
 *     description: >
 *       Redirects to Google OAuth. After consent, Google sends the user to
 *       `/api/auth/sso/google/callback`, then the API redirects to `CLIENT_URL` + `SSO_SUCCESS_PATH`
 *       with `?token=` (access JWT only). Use `Accept: application/json` or `?format=json` for access + refresh JSON.
 *     operationId: googleSsoStart
 *     responses:
 *       302:
 *         description: Redirect to Google
 *       503:
 *         description: Google SSO not configured
 */
router.get('/sso/google', googleSsoStart);

/**
 * @openapi
 * /api/auth/sso/google/callback:
 *   get:
 *     tags: [Accounts]
 *     summary: Google OAuth callback (redirect_uri)
 *     operationId: googleSsoCallback
 *     parameters:
 *       - in: query
 *         name: code
 *         schema: { type: string }
 *       - in: query
 *         name: state
 *         schema: { type: string }
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [json] }
 *         description: Return JSON body with token instead of redirecting to the SPA
 *     responses:
 *       302:
 *         description: Redirect to frontend with token query param
 *       200:
 *         description: JSON token (when Accept application/json or format=json)
 *       400:
 *         description: OAuth error or bad state
 */
router.get('/sso/google/callback', googleSsoCallback);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Accounts]
 *     summary: Register a new user
 *     operationId: register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserResponse'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Accounts]
 *     summary: User sign-in (returns access + refresh tokens)
 *     description: Use access JWT as Bearer; store refresh token securely for `/api/auth/refresh`.
 *     operationId: authUserSignIn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokensResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       423:
 *         description: Account temporarily locked (too many failed password attempts)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountLockedResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/sessions:
 *   get:
 *     tags: [Accounts]
 *     summary: List active refresh-token sessions (devices)
 *     description: Requires Bearer access JWT. Shows device label, IP, created and last-used times.
 *     operationId: listAuthSessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionsListResponse'
 *       401:
 *         description: Missing or invalid Bearer token
 */
router.get('/sessions', authenticate, listSessions);

/**
 * @openapi
 * /api/auth/audit-logs:
 *   get:
 *     tags: [Accounts]
 *     summary: Account audit trail (login-related events)
 *     description: >
 *       Returns recent audit rows for the authenticated user — login success/failure, lockouts,
 *       Google SSO sign-in. Each row includes time, IP, user-agent, and structured metadata.
 *     operationId: listMyAuditLogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 50 }
 *         description: Max rows (default 50, max 100)
 *     responses:
 *       200:
 *         description: Audit entries newest first
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLogsResponse'
 *       401:
 *         description: Missing or invalid Bearer token
 */
router.get('/audit-logs', authenticate, listMyAuditLogs);

/**
 * @openapi
 * /api/auth/logout-all:
 *   post:
 *     tags: [Accounts]
 *     summary: Log out from all devices
 *     description: Revokes every refresh token for the authenticated user. Access JWT may still work until expiry.
 *     operationId: logoutAllDevices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All refresh sessions revoked
 *       401:
 *         description: Missing or invalid Bearer token
 */
router.post('/logout-all', authenticate, logoutAllDevices);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Accounts]
 *     summary: Exchange refresh token for a new access + refresh pair
 *     description: Refresh tokens rotate — store the new refresh token and discard the old one.
 *     operationId: refreshAccessToken
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenInput'
 *     responses:
 *       200:
 *         description: New tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokensResponse'
 *       401:
 *         description: Invalid or expired refresh token
 *       422:
 *         description: Missing refreshToken
 */
router.post('/refresh', refresh);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Accounts]
 *     summary: Revoke a refresh token (sign out this session)
 *     operationId: logoutSession
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutInput'
 *     responses:
 *       200:
 *         description: Revoked (always succeeds from client perspective)
 */
router.post('/logout', logout);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Accounts]
 *     summary: Request password reset email (same response whether email exists)
 *     operationId: forgotPassword
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Instructions message (always the same for privacy)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleMessageResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/forgot-password', forgotPassword);

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     tags: [Accounts]
 *     summary: Set a new password using the token from the reset link
 *     operationId: resetPassword
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SimpleMessageResponse'
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/reset-password', resetPassword);

export default router;
