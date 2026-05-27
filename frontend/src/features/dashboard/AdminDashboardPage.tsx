import { useEffect } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearTenantError, listTenants } from '../../store/slices/tenantSlice'
import { clearUsersError, listUsers } from '../../store/slices/usersSlice'
import { layout } from '../../theme/tokens/spacing'
import { AdminQuickLinks } from './components/AdminQuickLinks'

export function AdminDashboardPage() {
  const dispatch = useAppDispatch()
  const tenants = useAppSelector((state) => state.tenants)
  const users = useAppSelector((state) => state.users)

  const loading = tenants.loading || users.loading
  const error = tenants.error ?? users.error

  useEffect(() => {
    dispatch(listTenants())
    dispatch(listUsers())
  }, [dispatch])

  function handleClearErrors() {
    dispatch(clearTenantError())
    dispatch(clearUsersError())
  }

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        p: { xs: 2, md: 4 },
        maxWidth: layout.maxContainerWidth,
        width: 1,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="headlineMd">Superadmin Dashboard</Typography>
        <Typography variant="bodyMd" color="text.secondary">
          Platform overview. Manage tenants and users from dedicated pages.
        </Typography>
      </Stack>

      {error ? (
        <Alert severity="error" onClose={handleClearErrors}>
          {error}
        </Alert>
      ) : null}

      {loading && tenants.items.length === 0 && users.items.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AdminQuickLinks tenantCount={tenants.items.length} userCount={users.items.length} />
      )}
    </Box>
  )
}
