import type { ColorSystemOptions } from '@mui/material/styles'

import { createPaletteChannel } from '../utils/create-palette-channel'
import { varAlpha } from '../utils/var-alpha'
import { themeConfig } from '../theme-config'
import type { ColorTokens } from '../tokens/colors'
import type { ThemeColorScheme } from '../theme-options'

export type PaletteColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'

export type CommonColorsExtend = {
  whiteChannel: string
  blackChannel: string
}

export type TypeTextExtend = {
  disabledChannel: string
}

export type TypeBackgroundExtend = {
  neutral: string
  neutralChannel: string
  sideNav: string
  bright: string
  containerLowest: string
  containerLow: string
  container: string
  containerHigh: string
  containerHighest: string
}

export type PaletteColorExtend = {
  lighter: string
  light: string
  main: string
  dark: string
  darker: string
  contrastText: string
  lighterChannel?: string
  darkerChannel?: string
  borderColor: string
  backgroundColorLight: string
  backgroundColorLighter: string
  inputBg: string
  disabledBg?: string
}

export type PaletteColorNoChannels = PaletteColorExtend

export type GreyExtend = {
  '25Channel': string
  '350Channel': string
  '50Channel': string
  '100Channel': string
  '200Channel': string
  '300Channel': string
  '400Channel': string
  '500Channel': string
  '550Channel': string
  '600Channel': string
  '700Channel': string
  '800Channel': string
  '900Channel': string
}

function buildSchemePalette(config: typeof themeConfig.palette, semantic: ColorTokens) {
  const primary = createPaletteChannel(config.primary)
  const secondary = createPaletteChannel(config.secondary)
  const info = createPaletteChannel(config.info)
  const success = createPaletteChannel(config.success)
  const warning = createPaletteChannel(config.warning)
  const error = createPaletteChannel(config.error)
  const common = createPaletteChannel(config.common)
  const grey = createPaletteChannel(config.grey)

  const text = createPaletteChannel({
    primary: semantic.onSurface,
    secondary: semantic.onSurfaceVariant,
    disabled: semantic.outline,
  })

  const background = createPaletteChannel({
    paper: semantic.surfaceContainerLowest,
    default: semantic.background,
    neutral: semantic.surfaceContainer,
    sideNav: semantic.surfaceContainerLow,
    bright: semantic.surfaceBright,
    containerLowest: semantic.surfaceContainerLowest,
    containerLow: semantic.surfaceContainerLow,
    container: semantic.surfaceContainer,
    containerHigh: semantic.surfaceContainerHigh,
    containerHighest: semantic.surfaceContainerHighest,
  })

  const action = {
    hover: varAlpha(grey['500Channel'], 0.08),
    selected: varAlpha(grey['500Channel'], 0.12),
    focus: varAlpha(primary.mainChannel, 0.12),
    disabled: varAlpha(grey['900Channel'], 0.38),
    disabledBackground: varAlpha(grey['500Channel'], 0.12),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
    active: grey[600],
  }

  return {
    primary,
    secondary,
    info,
    success,
    warning,
    error,
    common,
    grey,
    text,
    background,
    action,
    divider: semantic.outlineVariant,
  }
}

const lightScheme = buildSchemePalette(themeConfig.palette, themeConfig.colors.light)
const darkScheme = buildSchemePalette(themeConfig.paletteDark, themeConfig.colors.dark)

export const palette: Record<ThemeColorScheme, ColorSystemOptions['palette']> = {
  light: lightScheme,
  dark: {
    ...darkScheme,
    primary: createPaletteChannel({
      ...themeConfig.paletteDark.primary,
      main: themeConfig.colors.dark.primary,
      light: themeConfig.colors.dark.primaryContainer,
      lighter: themeConfig.colors.dark.primaryFixed,
    }),
  },
}
