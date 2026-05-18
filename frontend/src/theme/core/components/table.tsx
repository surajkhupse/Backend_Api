import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'
import { varAlpha } from '../../utils/var-alpha'

const MuiTableContainer: Components<Theme>['MuiTableContainer'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: radius.lg,
      border: `1px solid ${theme.vars.palette.divider}`,
      boxShadow: theme.vars.customShadows.card,
      overflow: 'hidden',
    }),
  },
}

const MuiTableHead: Components<Theme>['MuiTableHead'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiTableCell-head': {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: theme.vars.palette.text.secondary,
        backgroundColor: (theme.vars.palette.background as unknown as { sideNav: string }).sideNav,
        borderBottom: `1px solid ${theme.vars.palette.divider}`,
      },
    }),
  },
}

const MuiTableRow: Components<Theme>['MuiTableRow'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      transition: 'background-color 200ms ease',
      '&:hover': {
        backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.04),
      },
      '&:last-child td': { borderBottom: 0 },
    }),
  },
}

const MuiTableCell: Components<Theme>['MuiTableCell'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderColor: theme.vars.palette.divider,
      padding: theme.spacing(1.75, 2),
      fontSize: '0.875rem',
    }),
  },
}

export const table = { MuiTableContainer, MuiTableHead, MuiTableRow, MuiTableCell }
