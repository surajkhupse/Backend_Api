import type { MixinsOptions } from '@mui/material/styles'

import { glassSurface } from './glass'
import { meshBackground } from './mesh'

export const mixins = {
  hideScrollX: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  hideScrollY: {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  glassSurface,
  meshBackground,
} as MixinsOptions
