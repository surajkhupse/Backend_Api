import type { Shadows } from '@mui/material/styles'

import { varAlpha } from '../utils/var-alpha'
import type { ThemeColorScheme } from '../theme-options'

function createShadows(colorChannel: string): Shadows {
  const color1 = varAlpha(colorChannel, 0.12)
  const color2 = varAlpha(colorChannel, 0.08)
  const color3 = varAlpha(colorChannel, 0.06)

  return [
    'none',
    `0px 1px 2px ${color3}`,
    `0px 2px 4px ${color3}`,
    `0px 4px 8px ${color2}`,
    `0px 6px 12px ${color2}`,
    `0px 8px 16px ${color1}`,
    `0px 10px 20px ${color1}`,
    `0px 12px 24px ${color1}`,
    `0px 14px 28px ${color1}`,
    `0px 16px 32px ${color1}`,
    `0px 18px 36px ${color1}`,
    `0px 20px 40px ${color1}`,
    `0px 22px 44px ${color1}`,
    `0px 24px 48px ${color1}`,
    `0px 26px 52px ${color1}`,
    `0px 28px 56px ${color1}`,
    `0px 30px 60px ${color1}`,
    `0px 32px 64px ${color1}`,
    `0px 34px 68px ${color1}`,
    `0px 36px 72px ${color1}`,
    `0px 38px 76px ${color1}`,
    `0px 40px 80px ${color1}`,
    `0px 42px 84px ${color1}`,
    `0px 44px 88px ${color1}`,
    `0px 46px 92px ${color1}`,
  ]
}

export const shadows: Record<ThemeColorScheme, Shadows> = {
  light: createShadows('11 28 48'),
  dark: createShadows('0 0 0'),
}
