import type { Types } from 'mongoose';
import User from '../users/user.model';
import type { UserRole } from '../users/user.model';
import { parseUserRole } from './role.model';

export async function resolveUserRole(userId: Types.ObjectId | string): Promise<UserRole> {
  const user = await User.findById(userId).select('role').lean();
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }
  return parseUserRole(user.role);
}
