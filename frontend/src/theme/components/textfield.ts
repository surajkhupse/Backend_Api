import type { Components, Theme } from '@mui/material/styles'
import { eventProLight } from '../tokens/colors'
import { radius } from '../tokens/radius'

export const MuiTextField: Components<Theme>['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined',
    fullWidth: true,
  },
}

export const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => {
      const ep =
        theme.palette.mode === 'dark'
          ? theme.tokens.eventPro.dark
          : theme.tokens.eventPro.light
      return {
        borderRadius: radius.md,
        backgroundColor: ep.surfaceBright,
        fontSize: '16px',
        lineHeight: '24px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: ep.outlineVariant,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: ep.outlineVariant,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: ep.primary,
          borderWidth: 1,
          boxShadow: `0 0 0 4px rgba(53, 37, 205, 0.1)`,
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: ep.error,
        },
        '& input::placeholder': {
          color: ep.outline,
          opacity: 0.5,
        },
      }
    },
    input: {
      padding: '12px 16px',
      color: eventProLight.onSurface,
    },
  },
}

export const MuiInputLabel: Components<Theme>['MuiInputLabel'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      fontFamily: theme.typography.labelMd?.fontFamily,
      fontSize: '14px',
      fontWeight: 500,
      color: theme.palette.text.secondary,
      '&.Mui-focused': {
        color: theme.palette.text.secondary,
      },
    }),
  },
}

export const MuiFormHelperText: Components<Theme>['MuiFormHelperText'] = {
  styleOverrides: {
    root: {
      marginTop: 6,
      fontSize: '12px',
    },
  },
}
