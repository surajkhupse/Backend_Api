import type { Request } from 'express';

/** Client IP; respects `trust proxy` when enabled on the Express app. */
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

/** Prefer JSON body `deviceName`, then `X-Device-Name` header. */
export function resolveDeviceName(req: Request, bodyDevice?: unknown): string {
  const header = req.headers['x-device-name'];
  const fromHeader = typeof header === 'string' ? header : '';
  return normalizeDeviceName(bodyDevice ?? fromHeader);
}
