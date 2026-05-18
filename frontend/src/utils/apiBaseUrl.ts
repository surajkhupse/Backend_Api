/** Backend origin without trailing slash (from `VITE_API_URL`). */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
}

export function googleSsoStartUrl(): string {
  const base = getApiBaseUrl()
  if (!base) return ''
  return `${base}/api/auth/sso/google`
}
