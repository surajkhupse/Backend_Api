import { shadows as tokenShadows } from '../tokens/shadows'
import { varAlpha } from '../utils/var-alpha'
import { themeConfig } from '../theme-config'
import type { ThemeColorScheme } from '../theme-options'

export interface CustomShadows {
  z1?: string
  z4?: string
  z8?: string
  card?: string
  cardHover?: string
  primary?: string
  primaryHover?: string
  secondary?: string
  glass?: string
  dropdown?: string
  dialog?: string
  none?: string
  textField?: string
}

function createCustomShadows(mode: ThemeColorScheme): CustomShadows {
  const c = themeConfig.colors[mode]
  const channel = mode === 'light' ? '11 28 48' : '0 0 0'

  return {
    z1: `0 1px 2px ${varAlpha(channel, 0.06)}`,
    z4: `0 4px 12px ${varAlpha(channel, 0.08)}`,
    z8: tokenShadows.card,
    card: tokenShadows.card,
    cardHover: tokenShadows.cardHover,
    primary: tokenShadows.buttonPrimary,
    primaryHover: tokenShadows.buttonPrimaryHover,
    secondary: `0 4px 14px ${varAlpha(c.meshCyan, 0.2)}`,
    glass: tokenShadows.glass,
    dropdown: tokenShadows.dropdown,
    dialog: `0 24px 48px ${varAlpha(channel, 0.16)}`,
    none: 'none',
    textField: `0 1px 2px ${varAlpha(channel, 0.04)}`,
  }
}

export const customShadows: Record<ThemeColorScheme, CustomShadows> = {
  light: createCustomShadows('light'),
  dark: createCustomShadows('dark'),
}
