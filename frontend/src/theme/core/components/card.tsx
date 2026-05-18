import type { Components, Theme } from '@mui/material/styles'

import { radius } from '../../tokens/radius'

const TRANSITION = 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)'

const MuiCard: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      borderRadius: radius.lg,
      border: `1px solid ${theme.vars.palette.divider}`,
      boxShadow: theme.vars.customShadows.card,
      backgroundImage: 'none',
      transition: TRANSITION,
      '&:hover': {
        boxShadow: theme.vars.customShadows.cardHover,
      },
    }),
  },
}

const MuiCardHeader: Components<Theme>['MuiCardHeader'] = {
  defaultProps: {
    slotProps: {
      title: { variant: 'headlineMd' },
      subheader: { variant: 'bodySm', sx: { mt: 0.5 } },
    },
  },
  styleOverrides: { root: ({ theme }) => ({ padding: theme.spacing(3, 3, 0) }) },
}

const MuiCardContent: Components<Theme>['MuiCardContent'] = {
  styleOverrides: { root: ({ theme }) => ({ padding: theme.spacing(3) }) },
}

export const card = { MuiCard, MuiCardHeader, MuiCardContent }
