import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths'
import type { TenantRecord, TenantStatus } from '../../../services/api/tenantsApi'
import { MaterialSymbol } from '../../../theme'
import { TenantsStatCards } from './TenantsStatCards'
import { TenantsTable } from './TenantsTable'

type AllTenantsSectionProps = {
  tenants: TenantRecord[]
  loading: boolean
  error: string | null
  actionTenantId: string | null
  title?: string
  showManageLink?: boolean
  showActions?: boolean
  onRefresh: () => void
  onClearError: () => void
  onChangeStatus?: (id: string, status: TenantStatus) => void
  onDelete?: (id: string, name: string) => void
}

export function AllTenantsSection({
  tenants,
  loading,
  error,
  actionTenantId,
  title = 'All tenants',
  showManageLink = false,
  showActions = true,
  onRefresh,
  onClearError,
  onChangeStatus,
  onDelete,
}: AllTenantsSectionProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Typography variant="titleMd">{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onRefresh}
            disabled={loading}
            startIcon={<MaterialSymbol name="refresh" sx={{ fontSize: 18 }} />}
          >
            Refresh
          </Button>
          {showManageLink ? (
            <Button
              size="small"
              variant="contained"
              component={RouterLink}
              to={ROUTES.TENANTS}
              startIcon={<MaterialSymbol name="domain" sx={{ fontSize: 18 }} />}
            >
              Manage tenants
            </Button>
          ) : null}
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" onClose={onClearError}>
          {error}
        </Alert>
      ) : null}

      {!loading && tenants.length > 0 ? <TenantsStatCards tenants={tenants} /> : null}

      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'border.subtle',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {loading && tenants.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : tenants.length === 0 ? (
          <Typography variant="bodyMd" color="text.secondary" sx={{ py: 5, textAlign: 'center' }}>
            No tenants in the platform yet.
          </Typography>
        ) : (
          <TenantsTable
            tenants={tenants}
            actionTenantId={actionTenantId}
            onChangeStatus={onChangeStatus ?? (() => {})}
            onDelete={onDelete ?? (() => {})}
            showActions={showActions}
          />
        )}
      </Paper>
    </Box>
  )
}
