import type { Components, Theme } from '@mui/material/styles'
import { eventProLight, meshAccents } from './tokens/colors'
import { fontFamilyInter } from './typography'

export function createCssBaselineOverrides(): Components<Theme>['MuiCssBaseline'] {
  return {
    styleOverrides: (theme) => ({
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        margin: 0,
        fontFamily: fontFamilyInter,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background-color 0.25s ease, color 0.25s ease',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '*': {
        boxSizing: 'border-box',
      },
      '*::-webkit-scrollbar': {
        width: 10,
        height: 10,
      },
      '*::-webkit-scrollbar-track': {
        background: theme.palette.surface?.sunken ?? theme.palette.background.default,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.border?.subtle ?? theme.palette.divider,
        borderRadius: 9999,
        border: `2px solid ${theme.palette.surface?.sunken ?? theme.palette.background.default}`,
      },
      '*::-webkit-scrollbar-thumb:hover': {
        backgroundColor: theme.palette.border?.default ?? theme.palette.text.disabled,
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
}

/** Login mesh gradient — exact CSS from EventPro mockup. */
export function authMeshBackground(mode: 'light' | 'dark') {
  const bg = mode === 'light' ? eventProLight.background : eventProLight.inverseSurface
  const indigo = meshAccents.indigo
  const cyan = meshAccents.cyan

  if (mode === 'dark') {
    return {
      backgroundColor: bg,
      backgroundImage: [
        `radial-gradient(at 0% 0%, rgba(${indigo}, 0.2) 0px, transparent 50%)`,
        `radial-gradient(at 100% 0%, rgba(${cyan}, 0.15) 0px, transparent 50%)`,
        `radial-gradient(at 100% 100%, rgba(${indigo}, 0.12) 0px, transparent 50%)`,
        `radial-gradient(at 0% 100%, rgba(${cyan}, 0.1) 0px, transparent 50%)`,
      ].join(', '),
    }
  }

  return {
    backgroundColor: eventProLight.background,
    backgroundImage: [
      `radial-gradient(at 0% 0%, rgba(${indigo}, 0.15) 0px, transparent 50%)`,
      `radial-gradient(at 100% 0%, rgba(${cyan}, 0.15) 0px, transparent 50%)`,
      `radial-gradient(at 100% 100%, rgba(${indigo}, 0.1) 0px, transparent 50%)`,
      `radial-gradient(at 0% 100%, rgba(${cyan}, 0.1) 0px, transparent 50%)`,
    ].join(', '),
  }
}
