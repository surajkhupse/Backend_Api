import type { PaletteOptions } from '@mui/material/styles'
import { darkPalette, darkSemantic } from './modes/dark'
import { lightPalette, lightSemantic } from './modes/light'
import type { ResolvedThemeMode } from './types'
import { darkShadows, lightShadows } from './shadows'

export function getPaletteForMode(mode: ResolvedThemeMode): PaletteOptions {
  const base = mode === 'dark' ? darkPalette : lightPalette
  const semantic = mode === 'dark' ? darkSemantic : lightSemantic

  return {
    ...base,
    surface: { ...semantic.surface },
    border: { ...semantic.border },
    chart: { ...semantic.chart },
    eventPro: { ...semantic.eventPro },
  } as PaletteOptions
}

export function buildColorSchemes() {
  return {
    light: {
      palette: getPaletteForMode('light'),
      shadows: lightShadows,
    },
    dark: {
      palette: getPaletteForMode('dark'),
      shadows: darkShadows,
    },
  } as const
}
