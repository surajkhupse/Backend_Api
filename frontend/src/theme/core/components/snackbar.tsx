import type { AlertProps } from '@mui/material/Alert'
import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'

const MuiSnackbar: Components<Theme>['MuiSnackbar'] = {
  styleOverrides: {
    root: {
      '& .MuiSnackbarContent-root': {
        borderRadius: radius.lg,
      },
    },
  },
}

const MuiAlert: Components<Theme>['MuiAlert'] = {
  styleOverrides: {
    root: {
      borderRadius: radius.md,
      fontWeight: 500,
    },
    standard: ({ ownerState, theme }) => {
      const styles: Record<string, { backgroundColor: string; color: string }> = {
        success: {
          backgroundColor: theme.vars.palette.success.main,
          color: theme.vars.palette.success.contrastText,
        },
        error: {
          backgroundColor: theme.vars.palette.error.main,
          color: theme.vars.palette.error.contrastText,
        },
        warning: {
          backgroundColor: theme.vars.palette.warning.main,
          color: theme.vars.palette.warning.contrastText,
        },
      }
      const severity = ownerState.severity as AlertProps['severity']
      if (severity && styles[severity]) {
        return styles[severity]
      }
      return {}
    },
  },
}

export const snackbar = { MuiSnackbar, MuiAlert }
