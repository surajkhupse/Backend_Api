import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { AuditLogsPage } from '../features/audit'
import { AdminDashboardPage, TenantDashboardPage } from '../features/dashboard'
import { TenantsPage } from '../features/tenants'
import { UsersPage } from '../features/users'
import { LoginPage } from '../features/login'
import { ForgotPasswordPage } from '../features/forgot-password'
import { RegisterPage } from '../features/password'
import { NotFoundPage } from '../pages/NotFoundPage'
import { HomeRedirect, RoleDashboardRoute } from './RoleDashboardRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { ROUTES } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGN_UP} element={<RegisterPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomeRedirect />} />
          <Route element={<RoleDashboardRoute audience="tenant" />}>
            <Route path={ROUTES.TENANT_DASHBOARD} element={<TenantDashboardPage />} />
          </Route>
          <Route element={<RoleDashboardRoute audience="superadmin" />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
            <Route path={ROUTES.TENANTS} element={<TenantsPage />} />
            <Route path={ROUTES.USERS} element={<UsersPage />} />
          </Route>
          <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
