import { Request, Response, NextFunction } from 'express';
import { reply } from '../../utils/response';
import {
  UpdateMyProfileInput,
  getMyProfile,
  listUsers,
  updateMyProfile as updateMyProfileService,
} from './user.service';
export const list = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const users = await listUsers();
    return reply(res, 200, 'Users listed', { users });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    if (!req.authUserId) {
      return reply(res, 401, 'Authentication required');
    }
    const user = await getMyProfile(req.authUserId);
    return reply(res, 200, 'My profile', { user });
  } catch (error) {
    return next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    if (!req.authUserId) {
      return reply(res, 401, 'Authentication required');
    }
    const body = req.body as UpdateMyProfileInput;
    const user = await updateMyProfileService(req.authUserId, body);
    if (!user) {
      return reply(res, 404, 'User not found');
    }
    return reply(res, 200, 'My profile updated', { user });
  } catch (error) {
    return next(error);
  }
};