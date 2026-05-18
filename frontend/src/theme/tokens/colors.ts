/** EventPro / enterprise SaaS color tokens — single source of truth. */

export const lightColors = {
  primary: '#3525CD',
  primaryContainer: '#4F46E5',
  primaryFixed: '#E2DFFF',
  primaryFixedDim: '#C3C0FF',

  secondary: '#00687A',
  secondaryContainer: '#57DFFE',
  secondaryFixed: '#ACEDFF',

  background: '#F8F9FF',
  surface: '#F8F9FF',
  surfaceBright: '#F8F9FF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#EFF4FF',
  surfaceContainer: '#E5EEFF',
  surfaceContainerHigh: '#DCE9FF',
  surfaceContainerHighest: '#D3E4FE',

  onSurface: '#0B1C30',
  onSurfaceVariant: '#464555',
  outline: '#777587',
  outlineVariant: '#C7C4D8',
  /** Soft borders — cards, inputs, dividers */
  borderLight: '#E9EAEB',

  success: '#10B981',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  warning: '#F59E0B',

  meshIndigo: '79 70 229',
  meshCyan: '0 104 122',
} as const

export const darkColors = {
  primary: '#C3C0FF',
  primaryContainer: '#4F46E5',
  primaryFixed: '#E2DFFF',
  primaryFixedDim: '#3525CD',

  secondary: '#57DFFE',
  secondaryContainer: '#00687A',
  secondaryFixed: '#ACEDFF',

  background: '#0B1220',
  surface: '#111827',
  surfaceBright: '#1F2937',
  surfaceContainerLowest: '#0F172A',
  surfaceContainerLow: '#151D2E',
  surfaceContainer: '#1C2538',
  surfaceContainerHigh: '#243044',
  surfaceContainerHighest: '#2D3A52',

  onSurface: '#F3F4F8',
  onSurfaceVariant: '#B8B5C8',
  outline: '#8E8AA0',
  outlineVariant: '#3D4458',
  borderLight: '#2E3A4D',

  success: '#34D399',
  error: '#FFB4AB',
  errorContainer: '#93000A',
  warning: '#FBBF24',

  meshIndigo: '79 70 229',
  meshCyan: '87 223 254',
} as const

export type ColorTokens = {
  [K in keyof typeof lightColors]: string
}
