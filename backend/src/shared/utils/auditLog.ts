import type { Request } from 'express';
import type { Types } from 'mongoose';
import AuditLog, { type AuditAction } from '../../database/models/AuditLog';
import { getClientIp } from './requestMeta';

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

/**
 * Persists an audit row. Never throws — failures are logged to stderr only.
 */
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
