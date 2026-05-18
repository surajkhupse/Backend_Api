import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'

const MuiTooltip: Components<Theme>['MuiTooltip'] = {
  styleOverrides: {
    tooltip: ({ theme }) => ({
      borderRadius: radius.default,
      fontSize: '0.75rem',
      fontWeight: 500,
      padding: theme.spacing(0.75, 1.25),
      backgroundColor: theme.vars.palette.grey[800],
    }),
    arrow: ({ theme }) => ({
      color: theme.vars.palette.grey[800],
    }),
  },
}

export const tooltip = { MuiTooltip }
