import type { Components, Theme } from '@mui/material/styles'

import { layout } from '../../tokens/spacing'
import { varAlpha } from '../../utils/var-alpha'

const MuiDrawer: Components<Theme>['MuiDrawer'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      width: layout.sidebarWidth,
      boxSizing: 'border-box',
      borderRight: `1px solid ${theme.vars.palette.divider}`,
      backgroundColor: (theme.vars.palette.background as unknown as { sideNav: string }).sideNav,
      backgroundImage: 'none',
    }),
  },
}

const MuiListItemButton: Components<Theme>['MuiListItemButton'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: 8,
      margin: theme.spacing(0.25, 1),
      transition: 'all 200ms ease',
      '&.Mui-selected': {
        backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.12),
        color: theme.vars.palette.primary.main,
        boxShadow: `0 0 0 1px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.2)}`,
        '&:hover': {
          backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
        },
        '& .MuiListItemIcon-root': {
          color: theme.vars.palette.primary.main,
        },
      },
    }),
  },
}

export const drawer = { MuiDrawer, MuiListItemButton }
