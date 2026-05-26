import type { Request, Response, NextFunction } from 'express';
import { type Permission, roleHasPermission } from '../modules/permissions/permission.constants';
import { reply } from '../utils/response';

export function authorize(...permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const role = req.authRole;
    if (!role) {
      return reply(res, 401, 'Authentication required');
    }

    const ok = permissions.some((perm) => roleHasPermission(role, perm));
    if (!ok) {
      return reply(res, 403, 'Forbidden');
    }
    next();
  };
}
