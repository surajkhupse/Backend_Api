import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import { MaterialSymbol } from '../../../theme'

export function DashboardFab() {
  return (
    <Tooltip title="Quick Create" placement="left">
      <Fab
        color="primary"
        aria-label="Quick create"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}40`,
          '&:hover': { transform: 'scale(1.08)' },
          '&:active': { transform: 'scale(0.92)' },
          transition: 'transform 200ms ease',
        }}
      >
        <MaterialSymbol name="add" filled sx={{ fontSize: 28 }} />
      </Fab>
    </Tooltip>
  )
}
