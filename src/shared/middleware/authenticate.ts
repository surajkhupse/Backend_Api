import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import type { Request, Response, NextFunction } from 'express';
import { reply } from '../utils/apiResponse';

/**
 * Requires `Authorization: Bearer <access JWT>`.
 * Sets `req.authUserId` from the token payload `id` claim.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void | Response {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return reply(res, 500, 'Server configuration error');
  }
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return reply(res, 401, 'Authentication required');
  }
  const token = auth.slice(7).trim();
  if (!token) {
    return reply(res, 401, 'Authentication required');
  }
  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload & { id?: unknown };
    const id = decoded.id;
    const idStr = typeof id === 'string' ? id : id != null ? String(id) : '';
    if (!idStr || !mongoose.Types.ObjectId.isValid(idStr)) {
      return reply(res, 401, 'Invalid token');
    }
    req.authUserId = new mongoose.Types.ObjectId(idStr);
    next();
  } catch {
    return reply(res, 401, 'Invalid or expired token');
  }
}
