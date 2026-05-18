import type { PaletteOptions } from '@mui/material/styles'
import { eventProLight } from '../tokens/colors'

const c = eventProLight

/** Light mode — EventPro login mockup. */
export const lightPalette: PaletteOptions = {
  mode: 'light',
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
    hover: 'rgba(11, 28, 48, 0.04)',
    selected: 'rgba(53, 37, 205, 0.08)',
    focus: 'rgba(53, 37, 205, 0.1)',
  },
}

export const lightSemantic = {
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
    overlay: 'rgba(11, 28, 48, 0.45)',
  },
  border: {
    subtle: c.outlineVariant,
    default: c.outline,
    strong: c.onSurfaceVariant,
  },
  chart: {
    indigo: c.primaryContainer,
    cyan: c.secondaryContainer,
    slate: c.outline,
  },
  eventPro: c,
} as const
