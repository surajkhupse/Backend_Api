import type { Types } from 'mongoose';
import User from '../users/user.model';
import type { UserRole } from '../users/user.model';

export async function resolveUserRole(
  userId: Types.ObjectId | string
): Promise<{ role: UserRole; tenantId: Types.ObjectId | null }> {
  const user = await User.findById(userId).select('role tenant').lean();
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }
  return {
    role: user.role,
    tenantId: user.tenant ?? null,
  };
}