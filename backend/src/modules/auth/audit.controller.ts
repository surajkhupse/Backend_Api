import type { Request, Response } from 'express';
import AuditLog, { type AuditAction } from '../../database/models/AuditLog';
import { reply } from '../../shared/utils/apiResponse';

const AUDIT_ACTIONS: AuditAction[] = [
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'LOGIN_LOCKED',
  'LOGIN_SSO_SUCCESS',
];

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseActionFilter(raw: unknown): AuditAction | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const action = raw.trim() as AuditAction;
  return AUDIT_ACTIONS.includes(action) ? action : undefined;
}

function buildAuditFilter(userId: string, action?: AuditAction, search?: string): Record<string, unknown> {
  const filter: Record<string, unknown> = { user: userId };

  if (action) {
    filter.action = action;
  }

  const q = search?.trim();
  if (q) {
    const pattern = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ ipAddress: pattern }, { action: pattern }, { userAgent: pattern }];
  }

  return filter;
}

/**
 * Lists audit entries for the authenticated user (newest first).
 * Query: limit (1–100), action (audit action enum), q (search IP, action, user-agent).
 */
export const listMyAuditLogs = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const raw = Number(req.query.limit);
    const limit = Number.isFinite(raw) && raw > 0 ? Math.min(Math.floor(raw), 100) : 50;
    const action = parseActionFilter(req.query.action);
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;

    const filter = buildAuditFilter(String(req.authUserId), action, search);

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
