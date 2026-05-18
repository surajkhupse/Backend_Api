import type { Components, Theme } from '@mui/material/styles'
import { layout } from '../tokens/spacing'
import { zIndex } from '../tokens/zIndex'

export const MuiAppBar: Components<Theme>['MuiAppBar'] = {
  defaultProps: {
    elevation: 0,
    color: 'default',
  },
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'sticky',
      top: 0,
      zIndex: zIndex.appBar,
      minHeight: layout.headerHeight,
      backgroundColor: theme.palette.background.paper,
      backgroundImage: 'none',
      borderBottom: `1px solid ${theme.palette.divider}`,
      backdropFilter: 'blur(12px)',
      transition: 'background-color 0.2s ease, border-color 0.2s ease',
    }),
  },
}

export const MuiToolbar: Components<Theme>['MuiToolbar'] = {
  styleOverrides: {
    root: {
      minHeight: layout.headerHeight,
      paddingLeft: 24,
      paddingRight: 24,
      gap: 16,
    },
  },
}

export const MuiDrawer: Components<Theme>['MuiDrawer'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      width: layout.sidebarWidth,
      borderRight: `1px solid ${theme.palette.divider}`,
      backgroundImage: 'none',
      boxShadow: 'none',
    }),
  },
}
