import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TopRightToast } from '../../../components/TopRightToast'
import {
  consumeAuthFlash,
  LOGIN_SUCCESS_TOAST_MS,
  type AuthLocationState,
} from '../../../routes/authNavigation'

/**
 * Shows a short success toast after login or register.
 */
export function AuthSuccessToast() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const flash = consumeAuthFlash()
    if (flash === 'register') {
      setMessage('Account created. You are signed in.')
      setOpen(true)
      return
    }
    if (flash === 'login') {
      setMessage('Signed in successfully. Welcome back!')
      setOpen(true)
      return
    }

    const state = location.state as AuthLocationState | null
    if (state?.registerSuccess) {
      setMessage('Account created. You are signed in.')
      setOpen(true)
    } else if (state?.loginSuccess) {
      setMessage('Signed in successfully. Welcome back!')
      setOpen(true)
    }
  }, [location.pathname, location.state])

  function handleClose() {
    setOpen(false)
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }

  return (
    <TopRightToast
      open={open}
      message={message}
      severity="success"
      onClose={handleClose}
      autoHideDuration={LOGIN_SUCCESS_TOAST_MS}
    />
  )
}
