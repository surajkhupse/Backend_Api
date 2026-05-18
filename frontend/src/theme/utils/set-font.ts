export function setFont(fontFamily: string): string {
  const hasFallback = fontFamily.includes(',')
  return hasFallback ? fontFamily : `"${fontFamily}", sans-serif`
}
