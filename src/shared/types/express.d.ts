import type { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      /** Set by `authenticate` middleware after validating Bearer JWT */
      authUserId?: Types.ObjectId;
    }
  }
}

export {};
