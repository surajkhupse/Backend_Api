import type { Components, Theme } from '@mui/material/styles'

import type { PaletteColorKey, PaletteColorNoChannels } from '../palette'
import { radius } from '../../tokens/radius'

const OUTLINED_ALERT_COLORS: PaletteColorKey[] = ['success', 'error', 'warning', 'info']

function outlinedAlertStyles(theme: Theme, color: PaletteColorKey) {
  const palette = theme.palette[color] as unknown as PaletteColorNoChannels
  return {
    backgroundColor: palette.backgroundColorLight,
    color: theme.palette.text.primary,
    borderColor: palette.main,
    '& .MuiAlert-icon': {
      color: palette.main,
    },
  }
}

const MuiSnackbar: Components<Theme>['MuiSnackbar'] = {
  styleOverrides: {
    root: {
      '& .MuiSnackbarContent-root': {
        borderRadius: radius.lg,
      },
    },
  },
}

/** MUI v9: use root selectors + variants — `outlined` / `standard` override slots were removed. */
const MuiAlert: Components<Theme>['MuiAlert'] = {
  defaultProps: {
    variant: 'outlined',
  },
  styleOverrides: {
    root: ({ theme }) => {
      const outlinedByColor = Object.fromEntries(
        OUTLINED_ALERT_COLORS.map((color) => [
          `&.MuiAlert-outlined.MuiAlert-color${color.charAt(0).toUpperCase()}${color.slice(1)}`,
          outlinedAlertStyles(theme, color),
        ]),
      )

      return {
        borderRadius: radius.md,
        fontWeight: 500,
        ...outlinedByColor,
      }
    },
  },
}

export const snackbar = { MuiSnackbar, MuiAlert }
