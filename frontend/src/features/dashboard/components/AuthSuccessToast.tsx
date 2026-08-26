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
    const state = location.state as AuthLocationState | null
    let nextMessage = ''
    if (flash === 'register') {
      nextMessage = 'Account created. You are signed in.'
    } else if (flash === 'login') {
      nextMessage = 'Signed in successfully. Welcome back!'
    } else if (state?.registerSuccess) {
      nextMessage = 'Account created. You are signed in.'
    } else if (state?.loginSuccess) {
      nextMessage = 'Signed in successfully. Welcome back!'
    }

    if (nextMessage) {
      queueMicrotask(() => {
        setMessage(nextMessage)
        setOpen(true)
      })
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
