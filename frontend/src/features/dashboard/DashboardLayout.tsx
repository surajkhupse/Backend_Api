import Box from '@mui/material/Box'
import { Outlet, useLocation } from 'react-router-dom'
import { useIsSuperadmin } from '../auth/hooks/useAuthRole'
import { ROUTES } from '../../routes/paths'
import {
  AuthSuccessToast,
  DashboardFab,
  DashboardFooter,
  DashboardSidebar,
  DashboardTopBar,
} from './components'

export function DashboardLayout() {
  const { pathname } = useLocation()
  const isSuperadmin = useIsSuperadmin()
  const showFab = isSuperadmin
    ? pathname === ROUTES.ADMIN_DASHBOARD
    : pathname === ROUTES.TENANT_DASHBOARD

  return (
    <>
      <AuthSuccessToast />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          overflowX: 'hidden',
          typography: 'bodyMd',
        }}
      >
        <DashboardSidebar />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            minWidth: 0,
          }}
        >
          <DashboardTopBar />
          <Outlet />
          <DashboardFooter />
        </Box>

        {showFab ? <DashboardFab /> : null}
      </Box>
    </>
  )
}
