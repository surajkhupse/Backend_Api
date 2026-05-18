/**
 * EventPro design tokens — from the login mockup (Material-style semantic names).
 * Use via MUI palette + `theme.tokens.eventPro`.
 */
export const eventProLight = {
  primary: '#3525cd',
  onPrimary: '#ffffff',
  primaryContainer: '#4f46e5',
  onPrimaryContainer: '#dad7ff',
  primaryFixed: '#e2dfff',
  primaryFixedDim: '#c3c0ff',
  onPrimaryFixed: '#0f0069',
  onPrimaryFixedVariant: '#3323cc',
  inversePrimary: '#c3c0ff',

  secondary: '#00687a',
  onSecondary: '#ffffff',
  secondaryContainer: '#57dffe',
  onSecondaryContainer: '#006172',
  secondaryFixed: '#acedff',
  secondaryFixedDim: '#4cd7f6',
  onSecondaryFixed: '#001f26',
  onSecondaryFixedVariant: '#004e5c',

  tertiary: '#7e3000',
  onTertiary: '#ffffff',
  tertiaryContainer: '#a44100',
  onTertiaryContainer: '#ffd2be',
  tertiaryFixed: '#ffdbcc',
  tertiaryFixedDim: '#ffb695',
  onTertiaryFixed: '#351000',
  onTertiaryFixedVariant: '#7b2f00',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  background: '#f8f9ff',
  onBackground: '#0b1c30',
  surface: '#f8f9ff',
  onSurface: '#0b1c30',
  onSurfaceVariant: '#464555',
  surfaceBright: '#f8f9ff',
  surfaceDim: '#cbdbf5',
  surfaceTint: '#4d44e3',
  surfaceVariant: '#d3e4fe',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',

  outline: '#777587',
  outlineVariant: '#c7c4d8',

  inverseSurface: '#213145',
  inverseOnSurface: '#eaf1ff',
} as const

/** Dark scheme derived from inverse / fixed roles in the mockup. */
export const eventProDark = {
  primary: '#c3c0ff',
  onPrimary: '#0f0069',
  primaryContainer: '#4f46e5',
  onPrimaryContainer: '#dad7ff',
  primaryFixed: '#e2dfff',
  primaryFixedDim: '#c3c0ff',
  onPrimaryFixed: '#0f0069',
  onPrimaryFixedVariant: '#3323cc',
  inversePrimary: '#3525cd',

  secondary: '#4cd7f6',
  onSecondary: '#001f26',
  secondaryContainer: '#00687a',
  onSecondaryContainer: '#57dffe',
  secondaryFixed: '#acedff',
  secondaryFixedDim: '#4cd7f6',
  onSecondaryFixed: '#001f26',
  onSecondaryFixedVariant: '#004e5c',

  tertiary: '#ffb695',
  onTertiary: '#351000',
  tertiaryContainer: '#a44100',
  onTertiaryContainer: '#ffd2be',
  tertiaryFixed: '#ffdbcc',
  tertiaryFixedDim: '#ffb695',
  onTertiaryFixed: '#351000',
  onTertiaryFixedVariant: '#7b2f00',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  background: '#0b1c30',
  onBackground: '#eaf1ff',
  surface: '#0b1c30',
  onSurface: '#eaf1ff',
  onSurfaceVariant: '#c7c4d8',
  surfaceBright: '#213145',
  surfaceDim: '#0b1c30',
  surfaceTint: '#c3c0ff',
  surfaceVariant: '#464555',
  surfaceContainerLowest: '#213145',
  surfaceContainerLow: '#1a2838',
  surfaceContainer: '#213145',
  surfaceContainerHigh: '#2a3a4f',
  surfaceContainerHighest: '#334155',

  outline: '#948f9e',
  outlineVariant: '#464555',

  inverseSurface: '#eaf1ff',
  inverseOnSurface: '#0b1c30',
} as const

export const common = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const

/** Mesh gradient accent RGB (indigo + cyan from mockup). */
export const meshAccents = {
  indigo: '79, 70, 229',
  cyan: '87, 223, 254',
} as const
