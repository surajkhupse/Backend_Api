import type { UserRole } from '../users/user.model';

export const PERMISSIONS = {
  // Tenant management
  'tenants:create':   ['superadmin'],
  'tenants:read_any': ['superadmin'],
  'tenants:read_own': ['superadmin', 'tenant_admin'],
  'tenants:update':   ['superadmin', 'tenant_admin'],
  'tenants:delete':   ['superadmin'],
  'tenants:suspend':  ['superadmin'],
  'tenants:impersonate': ['superadmin'],

  // User management
  'users:read_self':   ['superadmin', 'tenant_admin', 'member', 'viewer'],
  'users:read_tenant': ['superadmin', 'tenant_admin'],
  'users:read_any':    ['superadmin'],
  'users:create':      ['superadmin', 'tenant_admin'],
  'users:update':      ['superadmin', 'tenant_admin'],
  'users:delete':      ['superadmin', 'tenant_admin'],
  'users:update_role': ['superadmin', 'tenant_admin'],

  // Role management
  'roles:read':   ['superadmin', 'tenant_admin'],
  'roles:create': ['superadmin', 'tenant_admin'],
  'roles:update': ['superadmin', 'tenant_admin'],
  'roles:delete': ['superadmin', 'tenant_admin'],

  // Events
  'events:read':   ['superadmin', 'tenant_admin', 'member', 'viewer'],
  'events:create': ['superadmin', 'tenant_admin', 'member'],
  'events:delete': ['superadmin', 'tenant_admin'],

  // Audit
  'audit:read_self': ['superadmin', 'tenant_admin', 'member', 'viewer'],
  'audit:read_any':  ['superadmin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly UserRole[]).includes(role);
}