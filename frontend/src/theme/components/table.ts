import type { Components, Theme } from '@mui/material/styles'
import { radius } from '../tokens/radius'

export const MuiTableContainer: Components<Theme>['MuiTableContainer'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: radius.lg,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[1],
      overflow: 'hidden',
    }),
  },
}

export const MuiTableHead: Components<Theme>['MuiTableHead'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiTableCell-head': {
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.surface?.sunken ?? theme.palette.action.hover,
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    }),
  },
}

export const MuiTableRow: Components<Theme>['MuiTableRow'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      transition: 'background-color 0.15s ease',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:last-child td': {
        borderBottom: 0,
      },
    }),
  },
}

export const MuiTableCell: Components<Theme>['MuiTableCell'] = {
  styleOverrides: {
    root: {
      fontSize: '0.875rem',
      padding: '14px 16px',
      borderColor: 'inherit',
    },
  },
}
