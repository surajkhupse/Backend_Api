import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'
import { varAlpha } from '../../utils/var-alpha'

const TRANSITION = 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'

const MuiButtonBase: Components<Theme>['MuiButtonBase'] = {
  styleOverrides: {
    root: { fontFamily: 'inherit', transition: TRANSITION },
  },
}

const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: { disableElevation: true },
  styleOverrides: {
    root: {
      borderRadius: radius.lg,
      fontWeight: 600,
      textTransform: 'none',
      transition: TRANSITION,
      '&:active': { transform: 'scale(0.98)' },
    },
    contained: ({ theme, ownerState }) => ({
      boxShadow: theme.vars.customShadows.primary,
      '&:hover': {
        boxShadow: theme.vars.customShadows.primaryHover,
        transform: 'translateY(-1px)',
      },
      ...(ownerState.color === 'primary' && {
        '&:hover': {
          backgroundColor: theme.vars.palette.primary.light,
        },
      }),
    }),
    outlined: ({ theme }) => ({
      borderColor: theme.vars.palette.divider,
      color: theme.vars.palette.text.secondary,
      '&:hover': {
        borderColor: theme.vars.palette.divider,
        backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.04),
      },
    }),
    sizeLarge: {
      minHeight: 48,
      padding: '12px 24px',
      fontSize: '0.875rem',
    },
    sizeMedium: {
      minHeight: 40,
      padding: '10px 20px',
    },
    sizeSmall: {
      minHeight: 32,
      padding: '6px 14px',
      fontSize: '0.8125rem',
    },
  },
}

export const button = { MuiButtonBase, MuiButton }
