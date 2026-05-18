import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'
import { varAlpha } from '../../utils/var-alpha'

const MuiChip: Components<Theme>['MuiChip'] = {
  styleOverrides: {
    root: {
      borderRadius: radius.full,
      fontWeight: 500,
      fontSize: '0.8125rem',
    },
    filled: ({ theme }) => ({
      '&.MuiChip-colorPrimary': {
        backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.12),
        color: theme.vars.palette.primary.main,
      },
    }),
    outlined: ({ theme }) => ({
      borderColor: theme.vars.palette.divider,
    }),
  },
}

export const chip = { MuiChip }
