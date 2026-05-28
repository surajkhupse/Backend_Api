import { Request, Response, NextFunction } from 'express';
import { reply } from '../../utils/response';
import { listUsers } from './user.service';

export const list = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const users = await listUsers();
    return reply(res, 200, 'Users listed', { users });
  } catch (error) {
    return next(error);
  }
};
