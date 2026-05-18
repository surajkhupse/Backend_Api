import { layout, spacing } from './tokens'

/** MUI breakpoint values (px). */
export const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
} as const

/** Responsive layout variables consumed via `theme.layout`. */
export const layoutVariables = {
  containerMax: layout.containerMax,
  sidebarWidth: layout.sidebarWidth,
  sidebarCollapsed: layout.sidebarCollapsed,
  headerHeight: layout.headerHeight,
  footerHeight: layout.footerHeight,
  contentPadding: spacing.lg,
  contentPaddingMobile: spacing.md,
} as const
