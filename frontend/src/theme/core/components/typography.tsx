import type { Components, Theme } from '@mui/material/styles'

/** Map custom variants to semantic elements for accessibility. */
const MuiTypography: Components<Theme>['MuiTypography'] = {
  defaultProps: {
    variantMapping: {
      display: 'h1',
      headlineLg: 'h2',
      headlineMd: 'h3',
      bodyLg: 'p',
      bodyMd: 'p',
      bodySm: 'p',
      titleMd: 'h3',
      labelMd: 'span',
      labelSm: 'span',
      mono: 'span',
    },
  },
}

export const typographyComponent = { MuiTypography }
