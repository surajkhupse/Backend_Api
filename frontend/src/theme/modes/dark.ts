import type { PaletteOptions } from '@mui/material/styles'
import { eventProDark } from '../tokens/colors'

const c = eventProDark

/** Dark mode — EventPro inverse roles. */
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: c.primary,
    dark: c.primaryContainer,
    light: c.primaryFixedDim,
    contrastText: c.onPrimary,
  },
  secondary: {
    main: c.secondary,
    light: c.secondaryContainer,
    dark: c.onSecondaryContainer,
    contrastText: c.onSecondary,
  },
  error: {
    main: c.error,
    light: c.errorContainer,
    contrastText: c.onError,
  },
  background: {
    default: c.background,
    paper: c.surfaceContainerLowest,
  },
  text: {
    primary: c.onSurface,
    secondary: c.onSurfaceVariant,
    disabled: c.outline,
  },
  divider: c.outlineVariant,
  action: {
    hover: 'rgba(234, 241, 255, 0.06)',
    selected: 'rgba(195, 192, 255, 0.12)',
    focus: 'rgba(195, 192, 255, 0.16)',
  },
}

export const darkSemantic = {
  surface: {
    main: c.surface,
    bright: c.surfaceBright,
    dim: c.surfaceDim,
    variant: c.surfaceVariant,
    containerLowest: c.surfaceContainerLowest,
    containerLow: c.surfaceContainerLow,
    container: c.surfaceContainer,
    containerHigh: c.surfaceContainerHigh,
    elevated: c.surfaceContainerLowest,
    sunken: c.surfaceContainerLow,
    overlay: 'rgba(0, 0, 0, 0.55)',
  },
  border: {
    subtle: c.outlineVariant,
    default: c.outline,
    strong: c.onSurfaceVariant,
  },
  chart: {
    indigo: c.primary,
    cyan: c.secondary,
    slate: c.outline,
  },
  eventPro: c,
} as const
