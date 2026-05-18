import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ResolvedThemeMode, ThemeMode } from '../types'

export const THEME_MODE_STORAGE_KEY = 'app-theme-mode'
export const DEFAULT_THEME_MODE: ResolvedThemeMode = 'light'

export type ThemeModeContextValue = {
  /** Current color scheme (`light` or `dark`). */
  mode: ResolvedThemeMode
  resolvedMode: ResolvedThemeMode
  setMode: (mode: ResolvedThemeMode | ThemeMode) => void
  toggleMode: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

function resolveMode(stored: string | null): ResolvedThemeMode {
  if (stored === 'dark') return 'dark'
  // `system` and unknown values → light (app default; ignore OS preference)
  return DEFAULT_THEME_MODE
}

function readStoredMode(): ResolvedThemeMode {
  try {
    const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY)
    const mode = resolveMode(stored)
    if (stored === 'system' || (stored != null && stored !== 'light' && stored !== 'dark')) {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
    }
    return mode
  } catch {
    /* private mode / SSR */
  }
  return DEFAULT_THEME_MODE
}

/** Apply `light` / `dark` on `<html>` before React paints (avoids flash). */
export function applyThemeModeToDocument(mode: ResolvedThemeMode): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.style.colorScheme = mode
}

applyThemeModeToDocument(
  typeof localStorage !== 'undefined'
    ? resolveMode(localStorage.getItem(THEME_MODE_STORAGE_KEY))
    : DEFAULT_THEME_MODE,
)

/** Internal state hook — used by `AppThemeProvider`. */
export function useThemeModeState(): ThemeModeContextValue {
  const [mode, setModeState] = useState<ResolvedThemeMode>(readStoredMode)

  const resolvedMode = mode

  useEffect(() => {
    try {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, resolvedMode)
    } catch {
      /* ignore */
    }
    applyThemeModeToDocument(resolvedMode)
  }, [resolvedMode])

  const setMode = useCallback((next: ResolvedThemeMode | ThemeMode) => {
    setModeState(next === 'dark' ? 'dark' : 'light')
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return useMemo(
    () => ({ mode, resolvedMode, setMode, toggleMode }),
    [mode, resolvedMode, setMode, toggleMode],
  )
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within AppThemeProvider')
  }
  return context
}
