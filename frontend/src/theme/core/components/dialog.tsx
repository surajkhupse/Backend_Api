import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'

const MuiDialog: Components<Theme>['MuiDialog'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      borderRadius: radius.lg,
      boxShadow: theme.vars.customShadows.dialog,
      backgroundImage: 'none',
    }),
  },
}

const MuiDialogTitle: Components<Theme>['MuiDialogTitle'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      ...theme.typography.headlineMd,
      padding: theme.spacing(3, 3, 1),
    }),
  },
}

const MuiDialogContent: Components<Theme>['MuiDialogContent'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(0, 3, 2),
    }),
  },
}

const MuiDialogActions: Components<Theme>['MuiDialogActions'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(2, 3, 3),
      gap: theme.spacing(1),
    }),
  },
}

export const dialog = { MuiDialog, MuiDialogTitle, MuiDialogContent, MuiDialogActions }
