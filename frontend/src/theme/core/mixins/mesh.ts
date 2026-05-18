import type { CSSObject } from '@mui/material/styles'

import { themeConfig } from '../../theme-config'

/** Indigo + cyan mesh background for auth / marketing surfaces. */
export function meshBackground(mode: 'light' | 'dark'): CSSObject {
  const c = themeConfig.colors[mode]
  const bg = c.background

  return {
    backgroundColor: bg,
    backgroundImage: [
      `radial-gradient(at 0% 0%, rgba(${c.meshIndigo}, 0.15) 0px, transparent 50%)`,
      `radial-gradient(at 100% 0%, rgba(${c.meshCyan}, 0.12) 0px, transparent 50%)`,
      `radial-gradient(at 100% 100%, rgba(${c.meshIndigo}, 0.1) 0px, transparent 50%)`,
      `radial-gradient(at 0% 100%, rgba(${c.meshCyan}, 0.08) 0px, transparent 50%)`,
    ].join(', '),
  }
}
