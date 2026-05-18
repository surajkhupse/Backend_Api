import type { Components, Theme } from '@mui/material/styles'
import { MuiAppBar, MuiDrawer, MuiToolbar } from './appbar'
import { MuiButton } from './button'
import { MuiCard, MuiCardContent, MuiCardHeader } from './card'
import { MuiDialog, MuiDialogActions, MuiDialogContent, MuiDialogTitle, MuiPaper } from './dialog'
import { MuiTableCell, MuiTableContainer, MuiTableHead, MuiTableRow } from './table'
import {
  MuiFormHelperText,
  MuiInputLabel,
  MuiOutlinedInput,
  MuiTextField,
} from './textfield'
import { createCssBaselineOverrides } from '../globalStyles'

export function createComponentOverrides(): Components<Omit<Theme, 'components'>> {
  return {
    MuiCssBaseline: createCssBaselineOverrides(),
    MuiButton,
    MuiCard,
    MuiCardContent,
    MuiCardHeader,
    MuiDialog,
    MuiDialogTitle,
    MuiDialogContent,
    MuiDialogActions,
    MuiPaper,
    MuiTextField,
    MuiOutlinedInput,
    MuiInputLabel,
    MuiFormHelperText,
    MuiTableContainer,
    MuiTableHead,
    MuiTableRow,
    MuiTableCell,
    MuiAppBar,
    MuiToolbar,
    MuiDrawer,
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: {
        root: {
          fontWeight: 500,
          transition: 'color 0.2s ease',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: 'color 0.2s ease',
          '&.Mui-checked': {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  }
}
