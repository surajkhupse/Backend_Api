import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { MaterialSymbol } from '../../../theme'
import type { AuditLogEntry } from '../types'

export type AuditLogsStatCardsProps = {
  entries: AuditLogEntry[]
}

export function AuditLogsStatCards({ entries }: AuditLogsStatCardsProps) {
  const securityAlerts = entries.filter(
    (e) => e.action === 'LOGIN_FAILURE' || e.action === 'LOGIN_LOCKED',
  ).length
  const successes = entries.filter(
    (e) => e.action === 'LOGIN_SUCCESS' || e.action === 'LOGIN_SSO_SUCCESS',
  ).length

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
      }}
    >
      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'border.subtle', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="labelMd" color="text.secondary">
            Total activity
          </Typography>
          <MaterialSymbol name="analytics" sx={{ color: 'primary.main' }} />
        </Box>
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
          {entries.length}
        </Typography>
        <Typography variant="bodySm" color="text.secondary" sx={{ mt: 1 }}>
          Sign-in events loaded from your account
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'border.subtle', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="labelMd" color="text.secondary">
            Security alerts
          </Typography>
          <MaterialSymbol name="gpp_maybe" sx={{ color: 'error.main' }} />
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {securityAlerts}
        </Typography>
        <Typography variant="bodySm" color="text.secondary" sx={{ mt: 1 }}>
          Failed or locked sign-in attempts
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'border.subtle', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="labelMd" color="text.secondary">
            Successful sign-ins
          </Typography>
          <MaterialSymbol name="check_circle" sx={{ color: 'success.main' }} />
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {successes}
        </Typography>
        <Typography variant="bodySm" color="text.secondary" sx={{ mt: 1 }}>
          Password and Google SSO successes in this list
        </Typography>
      </Paper>
    </Box>
  )
}
