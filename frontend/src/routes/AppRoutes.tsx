import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { AuthPlaceholderPage } from '../pages/AuthPlaceholderPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ROUTES } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route
        path={ROUTES.SIGN_UP}
        element={
          <AuthPlaceholderPage
            title="Create account"
            description="Registration UI is coming soon. Use the API or sign in with Google for now."
          />
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <AuthPlaceholderPage
            title="Reset password"
            description="Password reset UI is coming soon. Use POST /api/auth/forgot-password from the API docs."
          />
        }
      />
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
