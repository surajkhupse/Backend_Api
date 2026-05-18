import type { CSSObject, Theme } from '@mui/material/styles'

import { greyVar } from '../../utils/palette-access'
import { varAlpha } from '../../utils/var-alpha'

type GlassOptions = {
  blur?: number
  bgOpacity?: number
  borderOpacity?: number
}

/** Glassmorphism surface — topbar, panels, overlays. */
export function glassSurface(theme: Theme, opts: GlassOptions = {}): CSSObject {
  const { blur = 12, bgOpacity = 0.72, borderOpacity = 0.12 } = opts
  const channel = greyVar(theme.vars.palette.grey, '25Channel')

  return {
    backgroundColor: varAlpha(channel, bgOpacity),
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid ${varAlpha(channel, borderOpacity)}`,
  }
}
