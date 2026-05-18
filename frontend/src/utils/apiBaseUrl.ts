/** Backend origin without trailing slash (from `VITE_API_URL`). */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
  if (configured) return configured
  // Dev: use Vite proxy (/api → backend) when env is unset
  if (import.meta.env.DEV) return ''
  return ''
}

export function googleSsoStartUrl(): string {
  const base = getApiBaseUrl()
  if (!base) return ''
  return `${base}/api/auth/sso/google`
}
