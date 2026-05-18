import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'
import { greyVar } from '../../utils/palette-access'
import { varAlpha } from '../../utils/var-alpha'

const TRANSITION = 'border-color 200ms ease, box-shadow 200ms ease'

const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: radius.lg,
      backgroundColor: theme.vars.palette.background.paper,
      transition: TRANSITION,
      [`& .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: theme.vars.palette.divider,
      },
      '&:hover': {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: greyVar(theme.vars.palette.grey, '400Channel'),
        },
      },
      [`&.${outlinedInputClasses.focused}`]: {
        boxShadow: `0 0 0 3px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.2)}`,
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.vars.palette.primary.main,
          borderWidth: 1,
        },
      },
    }),
    input: {
      padding: '14px 16px',
      fontSize: '0.875rem',
    },
  },
}

const MuiTextField: Components<Theme>['MuiTextField'] = {
  defaultProps: { variant: 'outlined', size: 'medium' },
}

const MuiInputLabel: Components<Theme>['MuiInputLabel'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      fontSize: '0.875rem',
      color: theme.vars.palette.text.secondary,
      '&.Mui-focused': { color: theme.vars.palette.primary.main },
    }),
  },
}

export const textfield = { MuiOutlinedInput, MuiTextField, MuiInputLabel }
