import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerSessionExpiredHandler } from '../services/api/sessionExpired'
import { ROUTES } from '../routes/paths'

/**
 * Registers React Router navigation for axios session-expiry handling.
 * Must render inside `<BrowserRouter>`.
 */
export function SessionExpiredHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      navigate(`${ROUTES.LOGIN}?session=expired`, { replace: true })
    })
    return () => registerSessionExpiredHandler(null)
  }, [navigate])

  return null
}
