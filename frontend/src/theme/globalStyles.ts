import type { Components, CSSObject, Theme } from '@mui/material/styles'

import { meshBackground } from './core/mixins/mesh'

export const MuiCssBaseline: Components<Theme>['MuiCssBaseline'] = {
  styleOverrides: (theme) => ({
    html: {
      scrollBehavior: 'smooth',
      fontSize: 16,
    },
    body: {
      margin: 0,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.bodyMd?.fontSize ?? '1rem',
      lineHeight: theme.typography.bodyMd?.lineHeight ?? 1.5,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      transition: 'background-color 0.25s ease, color 0.25s ease',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    '*': { boxSizing: 'border-box' },
    '*::-webkit-scrollbar': { width: 8, height: 8 },
    '*::-webkit-scrollbar-track': { background: 'transparent' },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.divider,
      borderRadius: 9999,
    },
    '@keyframes auth-fade-in': {
      from: { opacity: 0, transform: 'translateY(8px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    '.material-symbols-outlined': {
      fontFamily: '"Material Symbols Outlined"',
      fontWeight: 'normal',
      fontStyle: 'normal',
      lineHeight: 1,
      letterSpacing: 'normal',
      textTransform: 'none',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    },
    '.material-symbols-outlined.filled': {
      fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    },
  }),
}

/** Mesh gradient auth / marketing background. */
export function authMeshBackground(mode: 'light' | 'dark'): CSSObject {
  return meshBackground(mode)
}
