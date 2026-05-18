import { AUTH_STORAGE_KEYS } from '../../../constants'

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

function readTokenFrom(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export function readStoredToken(key: string): string | null {
  try {
    const remember = getRememberMe()
    const primary = remember ? localStorage : sessionStorage
    const secondary = remember ? sessionStorage : localStorage
    return readTokenFrom(primary, key) ?? readTokenFrom(secondary, key)
  } catch {
    return null
  }
}

/** Read JWT pair from either storage (fixes remember-me / session mismatch on reload). */
export function readPersistedAuth(): {
  accessToken: string
  refreshToken: string
  rememberMe: boolean
} | null {
  try {
    const localAccess = readTokenFrom(localStorage, AUTH_STORAGE_KEYS.accessToken)
    const localRefresh = readTokenFrom(localStorage, AUTH_STORAGE_KEYS.refreshToken)
    if (localAccess && localRefresh) {
      return { accessToken: localAccess, refreshToken: localRefresh, rememberMe: true }
    }
    const sessionAccess = readTokenFrom(sessionStorage, AUTH_STORAGE_KEYS.accessToken)
    const sessionRefresh = readTokenFrom(sessionStorage, AUTH_STORAGE_KEYS.refreshToken)
    if (sessionAccess && sessionRefresh) {
      return { accessToken: sessionAccess, refreshToken: sessionRefresh, rememberMe: false }
    }
  } catch {
    /* ignore */
  }
  return null
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
