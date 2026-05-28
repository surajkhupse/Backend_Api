export const ROUTES = {
  HOME: '/',
  TENANT_DASHBOARD: '/tenant-dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard',
  TENANTS: '/tenants',
  USERS: '/users',
  AUDIT_LOGS: '/audit-logs',
  SETTINGS_PROFILE: '/settings/profile',
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
} as const

export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES]
