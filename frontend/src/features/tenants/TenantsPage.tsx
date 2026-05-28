import { useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  changeTenantStatus,
  clearTenantError,
  deleteTenant,
  impersonateTenant,
  listTenants,
} from '../../store/slices/tenantSlice'
import { beginImpersonation } from '../../store/slices/authSlice'
import type { TenantStatus } from '../../services/api/tenantsApi'
import { MaterialSymbol } from '../../theme'
import { layout } from '../../theme/tokens/spacing'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/paths'
import { CreateTenantDialog } from './components/CreateTenantDialog'
import { TenantsFilters, type TenantStatusFilter } from './components/TenantsFilters'
import { TenantsStatCards } from './components/TenantsStatCards'
import { TenantsTable } from './components/TenantsTable'

export function TenantsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, loading, error, actionTenantId } = useAppSelector((state) => state.tenants)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TenantStatusFilter>('all')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const debouncedSearch = useDebouncedValue(search, 300)

  useEffect(() => {
    dispatch(listTenants())
  }, [dispatch])

  const filteredTenants = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return items.filter((tenant) => {
      const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter
      const matchesSearch =
        !q ||
        tenant.name.toLowerCase().includes(q) ||
        tenant.slug.toLowerCase().includes(q) ||
        (tenant.domain?.toLowerCase().includes(q) ?? false)
      return matchesStatus && matchesSearch
    })
  }, [items, debouncedSearch, statusFilter])

  function handleRefresh() {
    dispatch(clearTenantError())
    dispatch(listTenants())
  }

  function handleClearFilters() {
    setSearch('')
    setStatusFilter('all')
  }

  async function handleChangeStatus(id: string, status: TenantStatus) {
    const result = await dispatch(changeTenantStatus({ id, status }))
    if (changeTenantStatus.fulfilled.match(result)) {
      setSuccessMessage(`Tenant status updated to "${status}"`)
    }
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Delete tenant "${name}"? This cannot be undone.`,
    )
    if (!confirmed) return
    const result = await dispatch(deleteTenant({ id }))
    if (deleteTenant.fulfilled.match(result)) {
      setSuccessMessage(`Tenant "${name}" deleted`)
    }
  }

  async function handleImpersonate(id: string, name: string) {
    const result = await dispatch(impersonateTenant({ id }))
    if (impersonateTenant.fulfilled.match(result)) {
      dispatch(
        beginImpersonation({
          accessToken: result.payload.accessToken,
          refreshToken: result.payload.refreshToken,
        }),
      )
      setSuccessMessage(`Now impersonating "${name}"`)
      navigate(ROUTES.TENANT_DASHBOARD)
    }
  }

  function handleCreated() {
    setSuccessMessage('Tenant created successfully')
    dispatch(listTenants())
  }

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 2, md: 4 },
        maxWidth: layout.maxContainerWidth,
        width: 1,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="headlineLg" sx={{ fontWeight: 600 }}>
            All tenants
          </Typography>
          <Typography variant="bodyMd" color="text.secondary" sx={{ mt: 0.5 }}>
            Full list of organizations on the platform. Create and manage tenants here.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<MaterialSymbol name="refresh" />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            startIcon={<MaterialSymbol name="add" />}
          >
            Create tenant
          </Button>
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearTenantError())}>
          {error}
        </Alert>
      ) : null}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {!loading && items.length > 0 ? <TenantsStatCards tenants={items} /> : null}

      <TenantsFilters
        search={search}
        statusFilter={statusFilter}
        resultCount={filteredTenants.length}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onClear={handleClearFilters}
      />

      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'border.subtle',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {loading && items.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredTenants.length === 0 ? (
          <Typography variant="bodyMd" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
            {items.length === 0
              ? 'No tenants yet. Create your first tenant to get started.'
              : 'No tenants match your filters.'}
          </Typography>
        ) : (
          <TenantsTable
            tenants={filteredTenants}
            actionTenantId={actionTenantId}
            onChangeStatus={handleChangeStatus}
            onDelete={handleDelete}
            onImpersonate={handleImpersonate}
          />
        )}
      </Paper>
      </Box>

      <CreateTenantDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage ?? ''}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  )
}
