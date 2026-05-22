import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import RefreshToken from '../../database/models/RefreshToken';
import User, { type UserRole } from '../../database/models/User';
import { issueAccessToken } from './issueJwt';
import { parseUserRole } from '../rbac/roles';
import { hashResetToken } from './passwordResetToken';

function newRefreshPlain(): string {
  return crypto.randomBytes(48).toString('hex');
}

export function hashRefreshToken(plain: string): string {
  return hashResetToken(plain);
}

export interface TokenPair {
  /** Short-lived JWT — send as `Authorization: Bearer` */
  accessToken: string;
  /** Opaque refresh credential — store securely; use only with `/api/auth/refresh` */
  refreshToken: string;
  /** Same as `accessToken` (legacy clients expect `token`) */
  token: string;
  /** Access token lifetime in seconds */
  expiresIn: number;
}

/** Optional metadata stored with the refresh session (device / IP). */
export interface SessionMeta {
  deviceName?: string;
  ipAddress?: string;
}

export interface SessionRecordDto {
  id: string;
  deviceName: string;
  ipAddress: string;
  createdAt: string;
  lastUsedAt: string;
}

function accessExpiresInSeconds(accessToken: string): number {
  const decoded = jwt.decode(accessToken);
  const exp =
    typeof decoded === 'object' &&
    decoded !== null &&
    'exp' in decoded &&
    typeof (decoded as jwt.JwtPayload).exp === 'number'
      ? (decoded as jwt.JwtPayload).exp!
      : 0;
  return Math.max(0, exp - Math.floor(Date.now() / 1000));
}

async function resolveUserRole(userId: Types.ObjectId | string): Promise<UserRole> {
  const user = await User.findById(userId).select('role').lean();
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }
  return parseUserRole(user.role);
}

export async function issueTokenPair(
  userId: Types.ObjectId | string,
  meta?: SessionMeta
): Promise<TokenPair> {
  const role = await resolveUserRole(userId);
  const accessToken = issueAccessToken(userId, role);
  const plainRefresh = newRefreshPlain();
  const tokenHash = hashRefreshToken(plainRefresh);
  const ttlMs =
    Number(process.env.REFRESH_TOKEN_TTL_MS) > 0
      ? Number(process.env.REFRESH_TOKEN_TTL_MS)
      : 7 * 24 * 60 * 60 * 1000;
  const now = new Date();
  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt: new Date(Date.now() + ttlMs),
    deviceName: meta?.deviceName?.trim() ? meta.deviceName.trim().slice(0, 200) : 'Unknown device',
    ipAddress: meta?.ipAddress ?? '',
    lastUsedAt: now,
  });
  const expiresIn = accessExpiresInSeconds(accessToken);
  return {
    accessToken,
    refreshToken: plainRefresh,
    token: accessToken,
    expiresIn,
  };
}

/** Validates refresh token, revokes it, and issues a new pair (rotation). */
export async function rotateRefreshToken(
  plainRefresh: string,
  meta?: SessionMeta
): Promise<TokenPair> {
  const trimmed = plainRefresh.trim();
  const hash = hashRefreshToken(trimmed);
  const doc = await RefreshToken.findOne({ tokenHash: hash });
  if (!doc || doc.expiresAt.getTime() <= Date.now()) {
    if (doc) await RefreshToken.deleteOne({ _id: doc._id });
    throw new Error('INVALID_REFRESH');
  }
  const user = await User.findById(doc.user);
  if (!user) {
    await RefreshToken.deleteOne({ _id: doc._id });
    throw new Error('INVALID_REFRESH');
  }
  const merged: SessionMeta = {
    deviceName: meta?.deviceName ?? doc.deviceName,
    ipAddress: meta?.ipAddress ?? doc.ipAddress,
  };
  await RefreshToken.deleteOne({ _id: doc._id });
  return issueTokenPair(doc.user, merged);
}

export async function revokeRefreshToken(plainRefresh: string): Promise<boolean> {
  const hash = hashRefreshToken(plainRefresh.trim());
  const result = await RefreshToken.deleteOne({ tokenHash: hash });
  return result.deletedCount > 0;
}

export async function revokeAllRefreshTokensForUser(userId: Types.ObjectId | string): Promise<void> {
  await RefreshToken.deleteMany({ user: userId });
}

/** Active refresh-token sessions for a user (newest activity first). */
export async function listSessionsForUser(userId: Types.ObjectId | string): Promise<SessionRecordDto[]> {
  const rows = await RefreshToken.find({ user: userId }).sort({ lastUsedAt: -1 }).lean();
  return rows.map((s) => {
    const created = s.createdAt ? new Date(s.createdAt) : new Date(0);
    const last = s.lastUsedAt ? new Date(s.lastUsedAt) : created;
    return {
      id: String(s._id),
      deviceName: typeof s.deviceName === 'string' && s.deviceName ? s.deviceName : 'Unknown device',
      ipAddress: typeof s.ipAddress === 'string' ? s.ipAddress : '',
      createdAt: created.toISOString(),
      lastUsedAt: last.toISOString(),
    };
  });
}
