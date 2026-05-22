import type { Types } from 'mongoose';
import { UserRole } from '../../database/models/User';

declare global {
  namespace Express {
    interface Request {
      /** Set by `authenticate` middleware after validating Bearer JWT */
      authUserId?: Types.ObjectId;
      authRole?: UserRole;
    }
  }
}

export {};
