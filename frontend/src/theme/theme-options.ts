import type {
  ColorSystemOptions,
  CssVarsThemeOptions,
  Direction,
  Shadows,
  ThemeOptions as MuiThemeOptions,
} from '@mui/material/styles'

import type { CustomShadows } from './core/custom-shadows'

export type ThemeColorScheme = 'light' | 'dark'
export type ThemeDirection = Direction
export type ThemeCssVariables = Pick<
  CssVarsThemeOptions,
  'colorSchemeSelector' | 'disableCssColorScheme' | 'cssVarPrefix' | 'shouldSkipGeneratingVar'
>

type ColorSchemeOptionsExtended = ColorSystemOptions & {
  shadows?: Shadows
  customShadows?: CustomShadows
}

export type ThemeOptions = Omit<MuiThemeOptions, 'components'> &
  Pick<CssVarsThemeOptions, 'defaultColorScheme' | 'components'> & {
    colorSchemes?: Record<ThemeColorScheme, ColorSchemeOptionsExtended>
    cssVariables?: ThemeCssVariables
  }
