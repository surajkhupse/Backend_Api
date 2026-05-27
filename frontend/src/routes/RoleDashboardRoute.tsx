import { Navigate, Outlet } from 'react-router-dom'
import { getDashboardHomeRoute } from '../features/auth/utils/dashboardRoutes'
import { getRoleFromAccessToken, isSuperadminRole } from '../features/auth/utils/jwt'
import { useAppSelector } from '../store/hooks'
import { ROUTES } from './paths'

type RoleDashboardRouteProps = {
  /** Which dashboard this route is for */
  audience: 'superadmin' | 'tenant'
}

export function RoleDashboardRoute({ audience }: RoleDashboardRouteProps) {
  const accessToken = useAppSelector((state) => state.auth.tokens?.accessToken)
  const roleFromStore = useAppSelector((state) => state.auth.role)
  const role = roleFromStore ?? getRoleFromAccessToken(accessToken)
  const isSuperadmin = isSuperadminRole(role)

  if (audience === 'superadmin' && !isSuperadmin) {
    return <Navigate to={ROUTES.TENANT_DASHBOARD} replace />
  }

  if (audience === 'tenant' && isSuperadmin) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
  }

  return <Outlet />
}

export function HomeRedirect() {
  const accessToken = useAppSelector((state) => state.auth.tokens?.accessToken)
  const role = useAppSelector((state) => state.auth.role)
  return <Navigate to={getDashboardHomeRoute(accessToken, role)} replace />
}
