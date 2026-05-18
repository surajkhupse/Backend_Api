import type { CSSProperties } from 'react'
import type { DesignTokens } from './tokens'
import type { layoutVariables } from './breakpoints'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedThemeMode = 'light' | 'dark'

declare module '@mui/material/styles' {
  interface Theme {
    tokens: DesignTokens
    layout: typeof layoutVariables
  }
  interface ThemeOptions {
    tokens?: DesignTokens
    layout?: typeof layoutVariables
  }

  interface PaletteColorSurface {
    main: string
    bright: string
    dim: string
    variant: string
    containerLowest: string
    containerLow: string
    container: string
    containerHigh: string
    elevated: string
    sunken: string
    overlay: string
  }

  interface PaletteColorBorder {
    subtle: string
    default: string
    strong: string
  }

  interface PaletteColorChart {
    indigo: string
    cyan: string
    slate: string
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type PaletteColorEventPro = Record<string, string>

  interface Palette {
    surface: PaletteColorSurface
    border: PaletteColorBorder
    chart: PaletteColorChart
    eventPro: PaletteColorEventPro
  }

  interface PaletteOptions {
    surface?: Partial<PaletteColorSurface>
    border?: Partial<PaletteColorBorder>
    chart?: Partial<PaletteColorChart>
    eventPro?: PaletteColorEventPro
  }

  interface TypographyVariants {
    headlineLg: CSSProperties
    headlineMd: CSSProperties
    bodyLg: CSSProperties
    bodyMd: CSSProperties
    bodySm: CSSProperties
    labelMd: CSSProperties
    labelSm: CSSProperties
    display: CSSProperties
    mono: CSSProperties
  }

  interface TypographyVariantsOptions {
    headlineLg?: CSSProperties
    headlineMd?: CSSProperties
    bodyLg?: CSSProperties
    bodyMd?: CSSProperties
    bodySm?: CSSProperties
    labelMd?: CSSProperties
    labelSm?: CSSProperties
    display?: CSSProperties
    mono?: CSSProperties
  }

  interface ColorSchemeOverrides {
    shadows?: string[]
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headlineLg: true
    headlineMd: true
    bodyLg: true
    bodyMd: true
    bodySm: true
    labelMd: true
    labelSm: true
    display: true
    mono: true
  }
}
