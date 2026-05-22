import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { MaterialSymbol } from '../../../theme'

export type AuditLogsEmptyStateProps = {
  filtered?: boolean
}

export function AuditLogsEmptyState({ filtered = false }: AuditLogsEmptyStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'background.containerLow',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <MaterialSymbol name="receipt_long" sx={{ fontSize: 28, color: 'text.secondary' }} />
      </Box>
      <Typography variant="headlineMd" sx={{ mb: 1 }}>
        {filtered ? 'No matching entries' : 'No activity yet'}
      </Typography>
      <Typography variant="bodySm" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
        {filtered
          ? 'Try clearing filters or changing your search.'
          : 'Sign-in events appear here after you log in, fail a password attempt, or use Google SSO.'}
      </Typography>
    </Paper>
  )
}
