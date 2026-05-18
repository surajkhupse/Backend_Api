import type { Components, Theme } from '@mui/material/styles'

import { layout } from '../../tokens/spacing'

const MuiAppBar: Components<Theme>['MuiAppBar'] = {
  defaultProps: { elevation: 0, color: 'transparent' },
  styleOverrides: {
    root: ({ theme }) => ({
      ...theme.mixins.glassSurface(theme, { blur: 12, bgOpacity: 0.8 }),
      boxShadow: theme.vars.customShadows.glass,
      minHeight: layout.topbarHeight,
      justifyContent: 'center',
    }),
  },
}

export const appBar = { MuiAppBar }
