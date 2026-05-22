export const ROUTES = {
  HOME: '/',
  AUDIT_LOGS: '/audit-logs',
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
} as const

export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES]
