import type { NavigateFunction } from 'react-router-dom'
import { AUTH_STORAGE_KEYS } from '../constants'
import { getDashboardHomeRoute } from '../features/auth/utils/dashboardRoutes'
import { readStoredToken } from '../features/auth/utils/authStorage'
import { syncRoleFromAccessToken } from '../features/auth/utils/jwt'

export type AuthLocationState = {
  loginSuccess?: boolean
  registerSuccess?: boolean
}

export const LOGIN_SUCCESS_TOAST_MS = 2000

const AUTH_FLASH_STORAGE_KEY = 'ep:auth-flash'

export type AuthFlashKind = 'login' | 'register'

function setAuthFlash(kind: AuthFlashKind): void {
  try {
    sessionStorage.setItem(AUTH_FLASH_STORAGE_KEY, kind)
  } catch {
    /* private mode / blocked storage */
  }
}

/** Read and clear one-shot flash after login/register (survives React Strict Mode remounts). */
export function consumeAuthFlash(): AuthFlashKind | null {
  try {
    const kind = sessionStorage.getItem(AUTH_FLASH_STORAGE_KEY) as AuthFlashKind | null
    if (kind) {
      sessionStorage.removeItem(AUTH_FLASH_STORAGE_KEY)
    }
    return kind
  } catch {
    return null
  }
}

function navigateAfterAuth(
  navigate: NavigateFunction,
  flash: AuthFlashKind,
  stateKey: 'loginSuccess' | 'registerSuccess',
  accessToken?: string | null,
): void {
  setAuthFlash(flash)
  const token = accessToken ?? readStoredToken(AUTH_STORAGE_KEYS.accessToken)
  const role = syncRoleFromAccessToken(token)
  navigate(getDashboardHomeRoute(token, role), {
    replace: true,
    state: { [stateKey]: true } satisfies AuthLocationState,
  })
}

export function navigateAfterLogin(
  navigate: NavigateFunction,
  accessToken?: string | null,
): void {
  navigateAfterAuth(navigate, 'login', 'loginSuccess', accessToken)
}

export function navigateAfterRegister(
  navigate: NavigateFunction,
  accessToken?: string | null,
): void {
  navigateAfterAuth(navigate, 'register', 'registerSuccess', accessToken)
}
