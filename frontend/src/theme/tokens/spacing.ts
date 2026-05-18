/** 8px base grid — aligns with MUI `theme.spacing(n)`. */
export const spacing = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const

/** Layout dimensions — matches mockup spacing tokens. */
export const layout = {
  containerMax: 1440,
  gutterMobile: 16,
  gutterDesktop: 24,
  marginPage: 32,
  sidebarWidth: 260,
  sidebarCollapsed: 72,
  headerHeight: 64,
  footerHeight: 48,
  contentPadding: 24,
  contentPaddingMobile: 16,
  loginMaxWidth: 440,
  authCardPadding: 32,
  brandIconSize: 64,
  brandIconRadius: 12,
  cardRadius: 12,
  fabBottom: 24,
  fabRight: 24,
} as const
