import type { Components, Theme } from '@mui/material/styles'
import { radius } from '../tokens/radius'

export const MuiDialog: Components<Theme>['MuiDialog'] = {
  defaultProps: {
    fullWidth: true,
    maxWidth: 'sm',
  },
}

export const MuiDialogTitle: Components<Theme>['MuiDialogTitle'] = {
  styleOverrides: {
    root: {
      fontWeight: 600,
      fontSize: '1.125rem',
      padding: '20px 24px 8px',
    },
  },
}

export const MuiDialogContent: Components<Theme>['MuiDialogContent'] = {
  styleOverrides: {
    root: {
      padding: '8px 24px 20px',
    },
  },
}

export const MuiDialogActions: Components<Theme>['MuiDialogActions'] = {
  styleOverrides: {
    root: {
      padding: '12px 24px 20px',
      gap: 8,
    },
  },
}

export const MuiPaper: Components<Theme>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme, ownerState }) => {
      if (ownerState.variant === 'elevation' && (ownerState.elevation ?? 0) > 0) {
        return {
          borderRadius: radius.lg,
          backgroundImage: 'none',
          boxShadow: theme.shadows[ownerState.elevation ?? 1],
        }
      }
      return {
        backgroundImage: 'none',
      }
    },
  },
}
