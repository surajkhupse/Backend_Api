import type { TypographyVariantsOptions } from '@mui/material/styles'
import { fontFamilies } from './tokens/fonts'

export const fontFamilyInter = fontFamilies.inter
export const fontFamilyGeist = fontFamilies.geist

export function createTypography(): TypographyVariantsOptions {
  return {
    fontFamily: fontFamilies.inter,
    h1: {
      fontFamily: fontFamilies.geist,
      fontWeight: 600,
      fontSize: '30px',
      lineHeight: '36px',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: fontFamilies.geist,
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '32px',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: fontFamilies.geist,
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '28px',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
    },
    button: {
      fontFamily: fontFamilies.geist,
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.02em',
      fontWeight: 500,
    },
    headlineLg: {
      fontFamily: fontFamilies.geist,
      fontSize: '30px',
      lineHeight: '36px',
      letterSpacing: '-0.02em',
      fontWeight: 600,
    },
    headlineMd: {
      fontFamily: fontFamilies.geist,
      fontSize: '20px',
      lineHeight: '28px',
      letterSpacing: '-0.01em',
      fontWeight: 600,
    },
    bodyLg: {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 400,
    },
    bodyMd: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
    },
    bodySm: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
    },
    labelMd: {
      fontFamily: fontFamilies.geist,
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.01em',
      fontWeight: 500,
    },
    labelSm: {
      fontFamily: fontFamilies.geist,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.02em',
      fontWeight: 500,
    },
    display: {
      fontFamily: fontFamilies.geist,
      fontSize: '48px',
      lineHeight: 1.1,
      letterSpacing: '-0.04em',
      fontWeight: 700,
    },
    mono: {
      fontFamily: fontFamilies.geistMono,
      fontSize: '13px',
      lineHeight: '20px',
      fontWeight: 400,
    },
  }
}
