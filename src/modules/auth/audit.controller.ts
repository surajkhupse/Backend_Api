import type { Request, Response } from 'express';
import AuditLog from '../../database/models/AuditLog';
import { reply } from '../../shared/utils/apiResponse';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

/**
 * Lists audit entries for the authenticated user (newest first).
 */
export const listMyAuditLogs = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const raw = Number(req.query.limit);
    const limit = Number.isFinite(raw) && raw > 0 ? Math.min(Math.floor(raw), 100) : 50;

    const rows = await AuditLog.find({ user: req.authUserId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

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
