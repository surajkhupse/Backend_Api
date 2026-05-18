import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'

type Props = {
  name: string
  filled?: boolean
  sx?: SxProps<Theme>
}

export function MaterialSymbol({ name, filled = false, sx }: Props) {
  return (
    <Box
      component="span"
      className={filled ? 'material-symbols-outlined filled' : 'material-symbols-outlined'}
      aria-hidden
      sx={sx}
    >
      {name}
    </Box>
  )
}
