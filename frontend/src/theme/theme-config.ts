import type { CommonColors } from '@mui/material/styles'

import type { PaletteColorNoChannels } from './core/palette'
import { darkColors, fontFamilies, lightColors, type ColorTokens } from './tokens'
import type { ThemeColorScheme, ThemeCssVariables, ThemeDirection } from './theme-options'

function buildPaletteColors(c: ColorTokens) {
  return {
    primary: {
      lighter: c.primaryFixed,
      light: c.primaryContainer,
      main: c.primary,
      dark: '#2A1FA3',
      darker: '#1E1678',
      contrastText: '#FFFFFF',
      borderColor: c.borderLight,
      backgroundColorLight: c.surfaceContainerLow,
      backgroundColorLighter: c.surfaceContainerLowest,
      inputBg: c.surfaceContainerLowest,
      disabledBg: c.surfaceContainer,
    },
    secondary: {
      lighter: c.secondaryFixed,
      light: c.secondaryContainer,
      main: c.secondary,
      dark: '#004F5C',
      darker: '#003840',
      contrastText: '#FFFFFF',
      borderColor: c.borderLight,
      backgroundColorLight: c.surfaceContainerLow,
      backgroundColorLighter: c.surfaceContainerLowest,
      inputBg: c.surfaceContainerLowest,
    },
    info: {
      lighter: '#E0E7FF',
      light: '#A5B4FC',
      main: c.primaryContainer,
      dark: '#3730A3',
      darker: '#312E81',
      contrastText: '#FFFFFF',
      borderColor: c.borderLight,
      backgroundColorLight: c.surfaceContainerLow,
      backgroundColorLighter: c.surfaceContainerLowest,
      inputBg: c.surfaceContainerLowest,
    },
    success: {
      lighter: '#D1FAE5',
      light: '#6EE7B7',
      main: c.success,
      dark: '#059669',
      darker: '#047857',
      contrastText: '#FFFFFF',
      borderColor: c.borderLight,
      backgroundColorLight: '#ECFDF5',
      backgroundColorLighter: '#F0FDF9',
      inputBg: c.surfaceContainerLowest,
    },
    warning: {
      lighter: '#FEF3C7',
      light: '#FCD34D',
      main: c.warning,
      dark: '#D97706',
      darker: '#B45309',
      contrastText: '#0B1C30',
      borderColor: c.borderLight,
      backgroundColorLight: '#FFFBEB',
      backgroundColorLighter: '#FFFEF5',
      inputBg: c.surfaceContainerLowest,
    },
    error: {
      lighter: c.errorContainer,
      light: '#FECACA',
      main: c.error,
      dark: '#991B1B',
      darker: '#7F1D1D',
      contrastText: '#FFFFFF',
      borderColor: c.borderLight,
      backgroundColorLight: c.errorContainer,
      backgroundColorLighter: '#FFF5F5',
      inputBg: c.surfaceContainerLowest,
    },
    grey: {
      '25': c.surfaceContainerLowest,
      '50': c.surface,
      '100': c.surfaceContainerLow,
      '200': c.surfaceContainer,
      '300': c.surfaceContainerHigh,
      '350': c.outlineVariant,
      '400': c.outline,
      '500': c.onSurfaceVariant,
      '550': c.onSurfaceVariant,
      '600': c.onSurface,
      '700': c.onSurface,
      '800': '#1a2332',
      '900': '#0B1220',
    },
    common: { black: '#000000', white: '#FFFFFF' },
  } satisfies Record<
    'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error',
    PaletteColorNoChannels
  > & {
    common: Pick<CommonColors, 'black' | 'white'>
    grey: Record<
      | '25'
      | '50'
      | '100'
      | '200'
      | '300'
      | '350'
      | '400'
      | '500'
      | '550'
      | '600'
      | '700'
      | '800'
      | '900',
      string
    >
  }
}

type ThemeConfig = {
  classesPrefix: string
  modeStorageKey: string
  direction: ThemeDirection
  defaultMode: ThemeColorScheme
  cssVariables: ThemeCssVariables
  fontFamily: typeof fontFamilies
  colors: { light: typeof lightColors; dark: typeof darkColors }
  palette: ReturnType<typeof buildPaletteColors>
  paletteDark: ReturnType<typeof buildPaletteColors>
}

export const themeConfig: ThemeConfig = {
  direction: 'ltr',
  defaultMode: 'light',
  modeStorageKey: 'theme-mode',
  classesPrefix: 'eventpro',
  fontFamily: fontFamilies,
  colors: { light: lightColors, dark: darkColors },
  palette: buildPaletteColors(lightColors),
  paletteDark: buildPaletteColors(darkColors),
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
}
