import type { TypographyVariantsOptions } from '@mui/material/styles'

import { fontFamilies, fontSizes } from '../tokens/typography'
import { pxToRem } from '../utils/px-to-rem'
import { setFont } from '../utils/set-font'

export type FontStyleExtend = {
  fontWeightSemiBold: number | string
  fontSecondaryFamily: string
  fontMonoFamily: string
}

const inter = setFont(fontFamilies.primary)
const geist = setFont(fontFamilies.heading)
const geistMono = setFont(fontFamilies.mono)

export const typography: TypographyVariantsOptions = {
  fontFamily: inter,
  fontSecondaryFamily: geist,
  fontMonoFamily: geistMono,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: { fontFamily: geist, fontWeight: 700, fontSize: pxToRem(48), lineHeight: 1.1, letterSpacing: '-0.04em' },
  h2: {
    fontFamily: geist,
    fontWeight: 600,
    fontSize: pxToRem(fontSizes.headlineLg),
    lineHeight: '28px',
    letterSpacing: '-0.02em',
  },
  h3: {
    fontFamily: geist,
    fontWeight: 600,
    fontSize: pxToRem(fontSizes.headlineMd),
    lineHeight: '26px',
    letterSpacing: '-0.01em',
  },
  h4: { fontFamily: geist, fontWeight: 600, fontSize: pxToRem(fontSizes.bodyLg), lineHeight: '24px' },
  h5: { fontWeight: 600, fontSize: pxToRem(fontSizes.bodyMd), lineHeight: '20px' },
  h6: { fontWeight: 600, fontSize: pxToRem(fontSizes.bodySm), lineHeight: '16px' },
  subtitle1: { fontWeight: 600, fontSize: pxToRem(fontSizes.bodyMd), lineHeight: '20px' },
  subtitle2: { fontWeight: 500, fontSize: pxToRem(fontSizes.bodySm), lineHeight: '16px' },
  body1: { fontSize: pxToRem(fontSizes.bodyMd), lineHeight: '20px' },
  body2: { fontSize: pxToRem(fontSizes.bodySm), lineHeight: '16px' },
  caption: { fontSize: pxToRem(fontSizes.labelSm), lineHeight: '16px' },
  overline: { fontWeight: 700, fontSize: pxToRem(11), letterSpacing: '0.08em', textTransform: 'uppercase' },
  button: {
    fontFamily: geist,
    fontWeight: 500,
    fontSize: pxToRem(fontSizes.labelMd),
    lineHeight: '16px',
    letterSpacing: '0.01em',
    textTransform: 'none',
  },
  display: {
    fontFamily: geist,
    fontWeight: 700,
    fontSize: pxToRem(fontSizes.display),
    lineHeight: 1.1,
    letterSpacing: '-0.04em',
  },
  headlineLg: {
    fontFamily: geist,
    fontWeight: 600,
    fontSize: pxToRem(fontSizes.headlineLg),
    lineHeight: '28px',
    letterSpacing: '-0.02em',
  },
  headlineMd: {
    fontFamily: geist,
    fontWeight: 600,
    fontSize: pxToRem(fontSizes.headlineMd),
    lineHeight: '26px',
    letterSpacing: '-0.01em',
  },
  bodyLg: { fontSize: pxToRem(fontSizes.bodyLg), lineHeight: '24px', fontWeight: 400 },
  bodyMd: { fontSize: pxToRem(fontSizes.bodyMd), lineHeight: '20px', fontWeight: 400 },
  bodySm: { fontSize: pxToRem(fontSizes.bodySm), lineHeight: '16px', fontWeight: 400 },
  titleMd: {
    fontFamily: geist,
    fontWeight: 600,
    fontSize: pxToRem(fontSizes.bodyLg),
    lineHeight: '24px',
  },
  labelMd: {
    fontFamily: geist,
    fontWeight: 500,
    fontSize: pxToRem(fontSizes.labelMd),
    lineHeight: '16px',
    letterSpacing: '0.01em',
  },
  labelSm: {
    fontFamily: geist,
    fontWeight: 500,
    fontSize: pxToRem(fontSizes.labelSm),
    lineHeight: '16px',
    letterSpacing: '0.02em',
  },
  mono: {
    fontFamily: geistMono,
    fontWeight: 400,
    fontSize: pxToRem(fontSizes.mono),
    lineHeight: '20px',
  },
}
