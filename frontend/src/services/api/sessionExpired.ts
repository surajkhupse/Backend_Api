import { isAxiosError } from 'axios'
import { AUTH_STORAGE_KEYS } from '../../constants'
import { readStoredToken } from '../../features/auth/utils/authStorage'
import { ROUTES } from '../../routes/paths'
import { store } from '../../store'
import { clearTokens } from '../../store/slices/authSlice'

/** Auth endpoints where 401 means bad credentials, not an expired session. */
const AUTH_401_SKIP_URL_PARTS = ['/api/auth/login', '/api/auth/register'] as const

type SessionExpiredHandler = (() => void) | null

let onSessionExpired: SessionExpiredHandler = null
let handling = false

export function registerSessionExpiredHandler(handler: SessionExpiredHandler): void {
  onSessionExpired = handler
}

function isSkippedAuth401(url: string): boolean {
  return AUTH_401_SKIP_URL_PARTS.some((part) => url.includes(part))
}

export function isSessionExpiredError(error: unknown): boolean {
  if (!isAxiosError(error) || error.response?.status !== 401) {
    return false
  }

  const url = error.config?.url ?? ''
  if (isSkippedAuth401(url)) {
    return false
  }

  const hadBearer =
    Boolean(error.config?.headers?.Authorization) ||
    Boolean(readStoredToken(AUTH_STORAGE_KEYS.accessToken))

  return hadBearer
}

/**
 * Clears stored auth and redirects to login (via registered handler or full navigation).
 */
export function handleSessionExpired(): void {
  if (handling) return

  const path = window.location.pathname
  if (
    path === ROUTES.LOGIN ||
    path === ROUTES.SIGN_UP ||
    path === ROUTES.FORGOT_PASSWORD
  ) {
    store.dispatch(clearTokens())
    return
  }

  handling = true
  store.dispatch(clearTokens())

  if (onSessionExpired) {
    onSessionExpired()
    window.setTimeout(() => {
      handling = false
    }, 500)
    return
  }

  const params = new URLSearchParams({ session: 'expired' })
  window.location.replace(`${ROUTES.LOGIN}?${params}`)
  handling = false
}

export function handleApiErrorSession(error: unknown): void {
  if (isSessionExpiredError(error)) {
    handleSessionExpired()
  }
}
