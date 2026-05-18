import { useMemo, type ReactNode } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { ThemeModeContext, useThemeModeState } from './hooks/useThemeMode'
import { createAppTheme } from './theme'

type Props = { children: ReactNode }

export function AppThemeProvider({ children }: Props) {
  const themeMode = useThemeModeState()
  const theme = useMemo(() => createAppTheme(), [])

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider
        theme={theme}
        defaultMode={themeMode.resolvedMode}
        key={themeMode.resolvedMode}
      >
        <CssBaseline enableColorScheme={false} />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
