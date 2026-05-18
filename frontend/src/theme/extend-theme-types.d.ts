import type {} from '@mui/material/themeCssVarsAugmentation'

import type { CustomShadows } from './core/custom-shadows'
import type { FontStyleExtend } from './core/typography'
import type {
  CommonColorsExtend,
  GreyExtend,
  PaletteBorderExtend,
  PaletteColorExtend,
  TypeBackgroundExtend,
  TypeTextExtend,
} from './core/palette'
import type { layout } from './tokens/spacing'

declare module '@mui/material/styles/createPalette' {
  interface Color extends GreyExtend {}
  interface TypeText extends TypeTextExtend {}
  interface CommonColors extends CommonColorsExtend {}
  interface TypeBackground extends TypeBackgroundExtend {}
  interface PaletteColor extends PaletteColorExtend {}
  interface SimplePaletteColorOptions extends PaletteColorExtend {}
  interface Palette {
    border: PaletteBorderExtend
  }
  interface PaletteOptions {
    border?: Partial<PaletteBorderExtend>
  }
}

declare module '@mui/material/styles/createTypography' {
  interface FontStyle extends FontStyleExtend {}
}

declare module '@mui/material/styles' {
  interface Mixins {
    hideScrollX: CSSObject
    hideScrollY: CSSObject
    glassSurface: (
      theme: import('@mui/material/styles').Theme,
      opts?: { blur?: number; bgOpacity?: number; borderOpacity?: number },
    ) => CSSObject
    meshBackground: (mode: 'light' | 'dark') => CSSObject
  }
  interface MixinsOptions {
    hideScrollX?: CSSObject
    hideScrollY?: CSSObject
    glassSurface?: Mixins['glassSurface']
    meshBackground?: Mixins['meshBackground']
  }
  interface TypographyVariants extends FontStyleExtend {
    display: CSSProperties
    headlineLg: CSSProperties
    headlineMd: CSSProperties
    bodyLg: CSSProperties
    bodyMd: CSSProperties
    bodySm: CSSProperties
    labelMd: CSSProperties
    labelSm: CSSProperties
  }
  interface TypographyVariantsOptions extends FontStyleExtend {
    display?: CSSProperties
    headlineLg?: CSSProperties
    headlineMd?: CSSProperties
    bodyLg?: CSSProperties
    bodyMd?: CSSProperties
    bodySm?: CSSProperties
    labelMd?: CSSProperties
    labelSm?: CSSProperties
  }
  interface Theme {
    customShadows: CustomShadows
    layout: typeof layout
  }
  interface ThemeOptions {
    customShadows?: CustomShadows
    layout?: typeof layout
  }
  interface ThemeVars {
    customShadows: CustomShadows
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true
    headlineLg: true
    headlineMd: true
    bodyLg: true
    bodyMd: true
    bodySm: true
    labelMd: true
    labelSm: true
  }
}
