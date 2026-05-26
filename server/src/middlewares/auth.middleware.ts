import jwt from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';
import type { Request, Response, NextFunction } from 'express';
import { reply } from '../utils/response';
import { UserRole } from '../modules/users/user.model';

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
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload & {
      id?: unknown;
      role?: unknown;
      tenantId?: unknown;
    };
    const id = decoded.id;
    const idStr = typeof id === 'string' ? id : id != null ? String(id) : '';
    if (!idStr || !mongoose.Types.ObjectId.isValid(idStr)) {
      return reply(res, 401, 'Invalid token');
    }
    req.authUserId = new mongoose.Types.ObjectId(idStr);
    req.authRole = decoded.role as UserRole;
    const tenantId = decoded.tenantId;
    if (typeof tenantId === 'string' && mongoose.Types.ObjectId.isValid(tenantId)) {
      req.authTenant = new mongoose.Types.ObjectId(tenantId);
    }
    next();
  } catch {
    return reply(res, 401, 'Invalid or expired token');
  }
}
