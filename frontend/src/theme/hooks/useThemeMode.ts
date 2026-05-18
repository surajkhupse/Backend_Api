import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { themeConfig } from '../theme-config'

const STORAGE_KEY = themeConfig.modeStorageKey
const DEFAULT_MODE = 'light' as const

export type ColorMode = 'light' | 'dark'

export type ThemeModeContextValue = {
  mode: ColorMode
  resolvedMode: ColorMode
  setMode: (mode: ColorMode) => void
  toggleMode: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

function resolveMode(stored: string | null): ColorMode {
  return stored === 'dark' ? 'dark' : DEFAULT_MODE
}

function readStoredMode(): ColorMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const mode = resolveMode(stored)
    if (stored === 'system' || (stored != null && stored !== 'light' && stored !== 'dark')) {
      localStorage.setItem(STORAGE_KEY, mode)
    }
    return mode
  } catch {
    /* ignore */
  }
  return DEFAULT_MODE
}

export function applyThemeModeToDocument(mode: ColorMode): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-color-scheme', mode)
  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.style.colorScheme = mode
}

applyThemeModeToDocument(
  typeof localStorage !== 'undefined' ? resolveMode(localStorage.getItem(STORAGE_KEY)) : DEFAULT_MODE,
)

export function useThemeModeState(): ThemeModeContextValue {
  const [mode, setModeState] = useState<ColorMode>(readStoredMode)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
    applyThemeModeToDocument(mode)
  }, [mode])

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return useMemo(
    () => ({ mode, resolvedMode: mode, setMode, toggleMode }),
    [mode, setMode, toggleMode],
  )
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within AppThemeProvider')
  }
  return context
}
