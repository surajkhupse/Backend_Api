/** `rgba(channel / opacity)` for MUI CSS variables (`mainChannel`, etc.). */
export function varAlpha(color: string, opacity = 1): string {
  const trimmed = color.trim()
  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('rgb') ||
    trimmed.startsWith('rgba') ||
    trimmed.startsWith('hsl')
  ) {
    throw new Error(`varAlpha: "${color}" must be a channel triplet, not a color literal`)
  }
  return `rgba(${trimmed} / ${opacity})`
}
