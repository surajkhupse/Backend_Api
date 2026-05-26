import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { Request } from 'express';
import type { Types } from 'mongoose';
import RefreshToken from './refreshToken.model';
import type { UserRole } from '../users/user.model';
import { issueAccessToken } from '../../utils/jwt';
import { resolveUserRole } from '../roles/role.service';
import AuditLog, { type AuditAction } from './audit.model';

// ── Hashing ──

export function createPlainResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(plainToken: string): string {
  return crypto.createHash('sha256').update(plainToken).digest('hex');
}

// ── Request helpers ──

export function getClientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.trim()) {
    return fwd.split(',')[0].trim();
  }
  if (Array.isArray(fwd) && fwd[0]) {
    return fwd[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '';
}

export function normalizeDeviceName(raw: unknown): string {
  if (typeof raw !== 'string') return 'Unknown device';
  const t = raw.trim().slice(0, 200);
  return t.length > 0 ? t : 'Unknown device';
}

export function resolveDeviceName(req: Request, bodyDevice?: unknown): string {
  const header = req.headers['x-device-name'];
  const fromHeader = typeof header === 'string' ? header : '';
  return normalizeDeviceName(bodyDevice ?? fromHeader);
}

// ── Token pair (access + refresh) ──

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  token: string;
  expiresIn: number;
}

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

export async function issueTokenPair(
  userId: Types.ObjectId | string,
  meta?: SessionMeta
): Promise<TokenPair> {
  const role = await resolveUserRole(userId);
  const accessToken = issueAccessToken(userId, role);
  const plainRefresh = crypto.randomBytes(48).toString('hex');
  const tokenHash = hashToken(plainRefresh);
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
  return { accessToken, refreshToken: plainRefresh, token: accessToken, expiresIn };
}

export async function rotateRefreshToken(
  plainRefresh: string,
  meta?: SessionMeta
): Promise<TokenPair> {
  const trimmed = plainRefresh.trim();
  const hash = hashToken(trimmed);
  const doc = await RefreshToken.findOne({ tokenHash: hash });
  if (!doc || doc.expiresAt.getTime() <= Date.now()) {
    if (doc) await RefreshToken.deleteOne({ _id: doc._id });
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
  const hash = hashToken(plainRefresh.trim());
  const result = await RefreshToken.deleteOne({ tokenHash: hash });
  return result.deletedCount > 0;
}

export async function revokeAllRefreshTokensForUser(userId: Types.ObjectId | string): Promise<void> {
  await RefreshToken.deleteMany({ user: userId });
}

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

// ── Audit logging ──

export interface AppendAuditParams {
  action: AuditAction;
  req: Request;
  userId?: Types.ObjectId | string;
  emailNormalized?: string;
  metadata?: Record<string, unknown>;
}

function truncateUa(req: Request): string {
  const raw = req.headers['user-agent'];
  if (typeof raw !== 'string') return '';
  return raw.slice(0, 500);
}

export function appendAuditLog(params: AppendAuditParams): void {
  const { action, req, userId, emailNormalized, metadata } = params;
  void AuditLog.create({
    action,
    ...(userId != null ? { user: userId } : {}),
    ...(emailNormalized != null && emailNormalized !== '' ? { emailNormalized } : {}),
    ipAddress: getClientIp(req),
    userAgent: truncateUa(req),
    ...(metadata != null && Object.keys(metadata).length > 0 ? { metadata } : {}),
  }).catch((err: unknown) => {
    console.error('[audit-log]', err instanceof Error ? err.message : err);
  });
}
