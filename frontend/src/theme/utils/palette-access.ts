import type { Color } from '@mui/material/styles'

import type { GreyExtend } from '../core/palette'

/** MUI `Color` + reference grey channel keys for `theme.vars.palette.grey`. */
export type GreyWithChannels = Color & GreyExtend

export function greyVar(grey: Color, channel: keyof GreyExtend): string {
  return (grey as GreyWithChannels)[channel]
}
