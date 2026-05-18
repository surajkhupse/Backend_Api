import { common, eventProDark, eventProLight, meshAccents } from './colors'
import { elevation, elevationDark } from './elevation'
import { fontFamilies } from './fonts'
import { layout, spacing } from './spacing'
import { radius } from './radius'
import { zIndex } from './zIndex'

export const tokens = {
  eventPro: {
    light: eventProLight,
    dark: eventProDark,
  },
  common,
  meshAccents,
  fontFamilies,
  spacing,
  layout,
  radius,
  elevation,
  elevationDark,
  zIndex,
} as const

export type DesignTokens = typeof tokens

export {
  eventProLight,
  eventProDark,
  common,
  meshAccents,
  fontFamilies,
  spacing,
  layout,
  radius,
  elevation,
  elevationDark,
  zIndex,
}
