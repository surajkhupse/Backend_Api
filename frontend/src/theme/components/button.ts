import type { Components, Theme } from '@mui/material/styles'
import { eventProLight } from '../tokens/colors'
import { elevation } from '../tokens/elevation'
import { radius } from '../tokens/radius'

export const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      borderRadius: radius.md,
      padding: '10px 16px',
      transition:
        'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
      '&:active': {
        transform: 'scale(0.98)',
      },
      '&.MuiButton-containedPrimary': {
        boxShadow: elevation.primaryButton,
        '&:hover': {
          backgroundColor: eventProLight.primaryContainer,
          boxShadow: elevation.primaryButton,
        },
      },
      '&.MuiButton-outlined': {
        borderColor: eventProLight.outlineVariant,
        color: eventProLight.onSurfaceVariant,
        '&:hover': {
          borderColor: eventProLight.outlineVariant,
          backgroundColor: eventProLight.surfaceContainerLow,
        },
      },
    },
    sizeLarge: {
      padding: '16px 16px',
      fontSize: '14px',
    },
    outlined: {
      borderWidth: 1,
      '&:hover': {
        borderWidth: 1,
      },
    },
  },
}
