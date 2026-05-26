import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Types } from 'mongoose';
import type { UserRole } from '../modules/users/user.model';

export function issueAccessToken(userId: Types.ObjectId | string, role: UserRole): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  const signOpts = {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  } as SignOptions;
  return jwt.sign({ id: userId, role }, secret, signOpts);
}
