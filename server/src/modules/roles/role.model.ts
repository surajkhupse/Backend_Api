import type { UserRole } from '../users/user.model';

const VALID_ROLES: readonly UserRole[] = ['user', 'organizer', 'admin'];

export function parseUserRole(value: unknown): UserRole {
  if (typeof value === 'string' && (VALID_ROLES as readonly string[]).includes(value)) {
    return value as UserRole;
  }
  return 'user';
}
