import type { Components, Theme } from '@mui/material/styles'
import { radius } from '../tokens/radius'

export const MuiCard: Components<Theme>['MuiCard'] = {
  defaultProps: {
    elevation: 0,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: radius.lg,
      border: `1px solid ${theme.palette.divider}`,
      backgroundImage: 'none',
      boxShadow: theme.shadows[2],
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
    }),
  },
}

export const MuiCardContent: Components<Theme>['MuiCardContent'] = {
  styleOverrides: {
    root: {
      padding: 24,
      '&:last-child': {
        paddingBottom: 24,
      },
    },
  },
}

export const MuiCardHeader: Components<Theme>['MuiCardHeader'] = {
  styleOverrides: {
    root: {
      padding: '20px 24px 0',
    },
    title: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
}
