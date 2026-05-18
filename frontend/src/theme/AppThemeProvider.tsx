import { useMemo, type ReactNode } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createAppTheme } from './theme'

type Props = { children: ReactNode }

/** MUI theme (light, black text) for pages that still use Material UI. */
export function AppThemeProvider({ children }: Props) {
  const theme = useMemo(() => createAppTheme('light'), [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}
