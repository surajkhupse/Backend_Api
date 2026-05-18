import { createTheme as createMuiTheme } from '@mui/material/styles'

import { components as coreComponents } from './core/components'
import { MuiCssBaseline } from './globalStyles'
import { customShadows } from './core/custom-shadows'
import { mixins } from './core/mixins/mixins'
import { palette } from './core/palette'
import { shadows } from './core/shadows'
import { typography } from './core/typography'
import { themeConfig } from './theme-config'
import { layout, radius, transitions } from './tokens'
import type { ThemeOptions } from './theme-options'

export const baseTheme = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light,
    },
    dark: {
      palette: palette.dark,
      shadows: shadows.dark,
      customShadows: customShadows.dark,
    },
  },
  mixins: mixins as ThemeOptions['mixins'],
  components: {
    ...coreComponents,
    MuiCssBaseline,
  },
  typography,
  shape: { borderRadius: radius.default },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  transitions: {
    duration: transitions.duration,
    easing: transitions.easing,
  },
  layout,
  direction: themeConfig.direction,
  cssVariables: themeConfig.cssVariables,
  defaultColorScheme: themeConfig.defaultMode,
} satisfies ThemeOptions

export function createAppTheme(themeOverrides: ThemeOptions = {}) {
  return createMuiTheme(baseTheme as ThemeOptions, themeOverrides)
}

export type AppTheme = ReturnType<typeof createAppTheme>
