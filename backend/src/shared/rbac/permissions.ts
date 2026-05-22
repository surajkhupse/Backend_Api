import type { UserRole } from '../../database/models/User';

export const PERMISSIONS = {
  'users:read_self': ['user', 'organizer', 'admin'],
  'users:read_any': ['admin'],
  'users:update_role': ['admin'],
  'events:read': ['user', 'organizer', 'admin'],
  'events:create': ['organizer', 'admin'],
  'events:delete': ['organizer', 'admin'],
  'audit:read_self': ['user', 'organizer', 'admin'],
  'audit:read_any': ['admin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly UserRole[]).includes(role);
}