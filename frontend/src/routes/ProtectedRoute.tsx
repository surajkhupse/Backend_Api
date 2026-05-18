import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { ROUTES } from './paths'

export function ProtectedRoute() {
  const auth = useAppSelector((state) => state.auth)

  if (!auth?.accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
