import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'
import { greyVar } from '../../utils/palette-access'
import { varAlpha } from '../../utils/var-alpha'

const MuiPaper: Components<Theme>['MuiPaper'] = {
  defaultProps: { elevation: 0 },
  styleOverrides: {
    root: { backgroundImage: 'none' },
    rounded: { borderRadius: radius.lg },
    outlined: ({ theme }) => ({
      borderColor: varAlpha(greyVar(theme.vars.palette.grey, '200Channel'), 0.9),
    }),
  },
}

export const paper = { MuiPaper }
