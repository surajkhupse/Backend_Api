import { AUTH_STORAGE_KEYS } from '../constants'

const REMEMBER_KEY = 'authRememberMe'

export function getRememberMe(): boolean {
  try {
    return localStorage.getItem(REMEMBER_KEY) === 'true'
  } catch {
    return false
  }
}

export function setRememberMe(remember: boolean): void {
  try {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, 'true')
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }
  } catch {
    /* ignore */
  }
}

/** Storage used for JWT pair (local when “remember me”, otherwise session). */
export function getAuthStorage(): Storage {
  return getRememberMe() ? localStorage : sessionStorage
}

export function readStoredToken(key: string): string | null {
  try {
    return getAuthStorage().getItem(key) ?? null
  } catch {
    return null
  }
}

export function persistTokens(
  accessToken: string,
  refreshToken: string,
  remember: boolean,
): void {
  setRememberMe(remember)
  const target = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage
  try {
    target.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken)
    target.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken)
    other.removeItem(AUTH_STORAGE_KEYS.accessToken)
    other.removeItem(AUTH_STORAGE_KEYS.refreshToken)
  } catch {
    /* quota / private mode */
  }
}

export function clearStoredTokens(): void {
  try {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem(AUTH_STORAGE_KEYS.accessToken)
      storage.removeItem(AUTH_STORAGE_KEYS.refreshToken)
    }
    localStorage.removeItem(REMEMBER_KEY)
  } catch {
    /* ignore */
  }
}
