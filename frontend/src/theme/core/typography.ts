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
  h2: { fontFamily: geist, fontWeight: 600, fontSize: pxToRem(30), lineHeight: '36px', letterSpacing: '-0.02em' },
  h3: { fontFamily: geist, fontWeight: 600, fontSize: pxToRem(20), lineHeight: 1.4 },
  h4: { fontFamily: geist, fontWeight: 600, fontSize: pxToRem(18), lineHeight: 1.4 },
  h5: { fontWeight: 600, fontSize: pxToRem(16), lineHeight: 1.5 },
  h6: { fontWeight: 600, fontSize: pxToRem(14), lineHeight: 1.5 },
  subtitle1: { fontWeight: 600, fontSize: pxToRem(16), lineHeight: 1.5 },
  subtitle2: { fontWeight: 500, fontSize: pxToRem(14), lineHeight: 1.43 },
  body1: { fontSize: pxToRem(fontSizes.bodyMd), lineHeight: 1.5 },
  body2: { fontSize: pxToRem(fontSizes.bodySm), lineHeight: 1.43 },
  caption: { fontSize: pxToRem(12), lineHeight: 1.33 },
  overline: { fontWeight: 700, fontSize: pxToRem(11), letterSpacing: '0.08em', textTransform: 'uppercase' },
  button: { fontWeight: 600, fontSize: pxToRem(14), lineHeight: 1.43, textTransform: 'none' },
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
    lineHeight: '36px',
    letterSpacing: '-0.02em',
  },
  headlineMd: {
    fontFamily: geist,
    fontWeight: 600,
    fontSize: pxToRem(fontSizes.headlineMd),
    lineHeight: 1.4,
  },
  bodyLg: { fontSize: pxToRem(fontSizes.bodyLg), lineHeight: 1.55 },
  bodyMd: { fontSize: pxToRem(fontSizes.bodyMd), lineHeight: 1.5 },
  bodySm: { fontSize: pxToRem(fontSizes.bodySm), lineHeight: 1.43 },
  labelMd: { fontWeight: 500, fontSize: pxToRem(fontSizes.labelMd), lineHeight: 1.43 },
  labelSm: { fontWeight: 500, fontSize: pxToRem(fontSizes.labelSm), lineHeight: 1.33 },
}
