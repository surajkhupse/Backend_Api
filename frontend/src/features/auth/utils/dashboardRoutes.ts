import { ROUTES, type AppRoutePath } from '../../../routes/paths'
import { getRoleFromAccessToken, isSuperadminRole, type UserRole } from './jwt'

export function getDashboardHomeRoute(
  accessToken: string | null | undefined,
  roleOverride?: UserRole | null,
): AppRoutePath {
  const role = roleOverride ?? getRoleFromAccessToken(accessToken)
  return isSuperadminRole(role) ? ROUTES.ADMIN_DASHBOARD : ROUTES.TENANT_DASHBOARD
}
