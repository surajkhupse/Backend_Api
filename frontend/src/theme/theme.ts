import { createTheme, type PaletteMode } from '@mui/material/styles'

const fontStack = 'system-ui, "Segoe UI", Roboto, sans-serif'

const brand = {
  light: {
    primary: '#aa3bff',
    primaryLight: '#c084fc',
    primaryDarkUi: '#8b2fd4',
  },
  dark: {
    primary: '#c084fc',
    primaryLight: '#e9d5ff',
    primaryDarkUi: '#9333ea',
  },
} as const

function paletteFor(mode: PaletteMode) {
  if (mode === 'light') {
    return {
      mode: 'light' as const,
      primary: {
        main: brand.light.primary,
        light: brand.light.primaryLight,
        dark: brand.light.primaryDarkUi,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6b6375',
        light: '#8b8499',
        dark: '#4a4458',
        contrastText: '#ffffff',
      },
      background: {
        default: '#ffffff',
        paper: '#fafaf9',
      },
      text: {
        primary: '#000000',
        secondary: '#000000',
      },
      divider: '#e5e4e7',
    }
  }
  return {
    mode: 'dark' as const,
    primary: {
      main: brand.dark.primary,
      light: brand.dark.primaryLight,
      dark: brand.dark.primaryDarkUi,
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9ca3af',
      light: '#d1d5db',
      dark: '#6b7280',
      contrastText: '#0c0a12',
    },
    background: {
      default: '#16171d',
      paper: '#1f2028',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
    divider: '#2e303a',
  }
}

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    cssVariables: true,
    palette: paletteFor(mode),
    typography: {
      fontFamily: fontStack,
      h1: {
        fontWeight: 500,
        letterSpacing: '-0.03em',
        fontSize: '2.5rem',
        lineHeight: 1.15,
        '@media (min-width:1025px)': { fontSize: '3.5rem' },
      },
      h2: {
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontSize: '1.25rem',
        lineHeight: 1.18,
        '@media (min-width:1025px)': { fontSize: '1.5rem' },
      },
      body1: { letterSpacing: '0.01em', lineHeight: 1.45 },
      button: { fontWeight: 500, letterSpacing: '0.02em' },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: fontStack,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            paddingInline: 18,
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  })
}
