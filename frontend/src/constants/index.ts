export const APP_NAME = 'frontend'
export const APP_BRAND_NAME = 'EventPro'

/** sessionStorage keys — must match `authSlice` / API client usage */
export const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const
