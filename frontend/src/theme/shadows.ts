import type { Shadows } from '@mui/material/styles'
import { elevation, elevationDark } from './tokens/elevation'

/** MUI expects 25 shadow slots; we map token elevations into the standard array. */
function buildShadowArray(levels: { xs: string; sm: string; md: string; lg: string; xl: string }): Shadows {
  return [
    'none',
    levels.xs,
    levels.sm,
    levels.sm,
    levels.md,
    levels.md,
    levels.lg,
    levels.lg,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
    levels.xl,
  ] as Shadows
}

export const lightShadows = buildShadowArray(elevation)
export const darkShadows = buildShadowArray(elevationDark)
