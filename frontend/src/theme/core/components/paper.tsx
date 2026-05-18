import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'

const MuiPaper: Components<Theme>['MuiPaper'] = {
  defaultProps: { elevation: 0 },
  styleOverrides: {
    root: { backgroundImage: 'none' },
    rounded: { borderRadius: radius.lg },
    outlined: ({ theme }) => ({
      borderColor: theme.vars.palette.divider,
    }),
  },
}

export const paper = { MuiPaper }
