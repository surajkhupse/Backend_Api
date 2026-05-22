import type { NavigateFunction } from 'react-router-dom'
import { ROUTES } from './paths'

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

export function navigateAfterLogin(navigate: NavigateFunction): void {
  setAuthFlash('login')
  navigate(ROUTES.HOME, {
    replace: true,
    state: { loginSuccess: true } satisfies AuthLocationState,
  })
}

export function navigateAfterRegister(navigate: NavigateFunction): void {
  setAuthFlash('register')
  navigate(ROUTES.HOME, {
    replace: true,
    state: { registerSuccess: true } satisfies AuthLocationState,
  })
}
