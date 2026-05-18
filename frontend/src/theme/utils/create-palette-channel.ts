function hexToRgbChannel(hex: string): string {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized
  const int = Number.parseInt(value, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `${r} ${g} ${b}`
}

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
}

type ChannelKeys<T> = {
  [K in keyof T as T[K] extends string ? `${string & K}Channel` : never]: string
}

/** Adds `*Channel` keys for hex values (Minimals / MUI CSS vars pattern). */
export function createPaletteChannel<T extends Record<string, unknown>>(
  palette: T,
): T & ChannelKeys<T> {
  const channels = Object.entries(palette).reduce<Record<string, string>>((acc, [key, value]) => {
    if (isHexColor(value)) {
      acc[`${key}Channel`] = hexToRgbChannel(value)
    }
    return acc
  }, {})

  return { ...palette, ...channels } as T & ChannelKeys<T>
}
