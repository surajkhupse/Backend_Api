export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
} as const

export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES]
