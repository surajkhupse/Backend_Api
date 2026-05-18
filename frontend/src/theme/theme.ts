import { createTheme } from '@mui/material/styles'
import { breakpoints, layoutVariables } from './breakpoints'
import { buildColorSchemes } from './palette'
import { createComponentOverrides } from './components'
import { createTypography } from './typography'
import { tokens } from './tokens'
import { radius } from './tokens/radius'
import './types'

export function createAppTheme() {
  const colorSchemes = buildColorSchemes()

  return createTheme({
    cssVariables: {
      colorSchemeSelector: 'class',
    },
    colorSchemes: colorSchemes,
    typography: createTypography(),
    breakpoints,
    shape: {
      borderRadius: radius.default,
    },
    tokens,
    layout: layoutVariables,
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
    components: createComponentOverrides(),
  })
}

export type AppTheme = ReturnType<typeof createAppTheme>
