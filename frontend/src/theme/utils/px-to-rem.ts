const BASE_FONT_SIZE = 16

export function pxToRem(value: number): string {
  return `${value / BASE_FONT_SIZE}rem`
}
