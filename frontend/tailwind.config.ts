import type { Config } from 'tailwindcss'
import { eventProLight, layout, radius, spacing } from './src/theme/tokens'

/** Optional Tailwind bridge — mirrors EventPro tokens (UI uses MUI theme). */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: eventProLight.primary,
        'primary-container': eventProLight.primaryContainer,
        secondary: eventProLight.secondary,
        'secondary-container': eventProLight.secondaryContainer,
        background: eventProLight.background,
        surface: eventProLight.surface,
        'on-surface': eventProLight.onSurface,
        'on-surface-variant': eventProLight.onSurfaceVariant,
        'surface-bright': eventProLight.surfaceBright,
        'surface-container-lowest': eventProLight.surfaceContainerLowest,
        'surface-container-low': eventProLight.surfaceContainerLow,
        outline: eventProLight.outline,
        'outline-variant': eventProLight.outlineVariant,
        error: eventProLight.error,
      },
      borderRadius: {
        DEFAULT: `${radius.default}px`,
        lg: `${radius.md}px`,
        xl: `${radius.lg}px`,
        full: `${radius.full}px`,
      },
      spacing: {
        'gutter-mobile': `${layout.gutterMobile}px`,
        'gutter-desktop': `${layout.gutterDesktop}px`,
        'margin-page': `${layout.marginPage}px`,
        unit: `${spacing.unit}px`,
      },
      maxWidth: {
        login: `${layout.loginMaxWidth}px`,
      },
      fontFamily: {
        geist: ['Geist', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
