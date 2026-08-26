import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { TopRightToast } from '../../components/TopRightToast'
import { GoogleLogo } from '../auth'
import { ROUTES } from '../../routes/paths'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearAuthError, login } from '../../store/slices/authSlice'
import { googleSsoStartUrl } from '../../utils/apiBaseUrl'
import { MaterialSymbol } from '../../theme'
import { loginFormSchema, type LoginFormValues } from './loginFormSchema'

export type LoginFormProps = {
  onSuccess?: (accessToken: string) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch()
  const { loading: authLoading, error: authError, accountLocked } = useAppSelector((state) => state.auth)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastDetail, setToastDetail] = useState<string | undefined>()
  const [toastSeverity, setToastSeverity] = useState<'error' | 'warning'>('error')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  useEffect(() => {
    if (authError) {
      let nextToastMessage: string
      let nextToastSeverity: 'error' | 'warning'
      let nextToastDetail: string | undefined

      if (accountLocked) {
        const lockUntil = accountLocked.lockUntil
        nextToastMessage = accountLocked.message ?? 'Account temporarily locked.'
        nextToastSeverity = 'warning'
        nextToastDetail = lockUntil
          ? `Unlocks after ${new Date(lockUntil).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}`
          : undefined
      } else {
        nextToastMessage = authError
        nextToastSeverity = 'error'
        nextToastDetail = undefined
      }

      queueMicrotask(() => {
        setToastMessage(nextToastMessage)
        setToastSeverity(nextToastSeverity)
        setToastDetail(nextToastDetail)
        setToastOpen(true)
      })
    }
  }, [authError, accountLocked])

  function closeToast() {
    setToastOpen(false)
    dispatch(clearAuthError())
  }

  const ssoUrl = googleSsoStartUrl()

  function handleGoogleSignIn() {
    if (!ssoUrl) {
      setToastMessage('API URL is not configured. Set VITE_API_URL in your environment.')
      setToastSeverity('error')
      setToastOpen(true)
      return
    }
    window.location.href = ssoUrl
  }

  async function onSubmit(data: LoginFormValues) {
    closeToast()
    const result = await dispatch(login({
      email: data.email,
      password: data.password,
      rememberMe: Boolean(data.rememberMe),
    }))
    if (login.fulfilled.match(result) && result.payload.accessToken) {
      onSuccess?.(result.payload.accessToken)
    }
  }

  const emailReg = register('email')
  const passwordReg = register('password')
  const rememberReg = register('rememberMe')

  return (
    <>
      <TopRightToast
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        detail={toastDetail}
        onClose={closeToast}
      />

      <Button
        type="button"
        variant="outlined"
        fullWidth
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        startIcon={<GoogleLogo width={20} height={20} />}
        sx={{
          py: 1.5,
          borderColor: 'border.subtle',
          color: 'text.secondary',
          fontWeight: 500,
          '&:hover': { borderColor: 'border.subtle', bgcolor: 'background.containerLow' },
        }}
      >
        Sign in with Google
      </Button>

      <Divider
        sx={{
          my: 4,
          '&::before, &::after': { borderColor: 'border.subtle' },
        }}
      >
        <Typography
          variant="labelSm"
          sx={{
            bgcolor: 'background.paper',
            px: 2,
            color: 'text.disabled',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          or continue with email
        </Typography>
      </Divider>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <TextField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            disabled={isSubmitting}
            error={!!errors.email}
            helperText={errors.email?.message}
            name={emailReg.name}
            onChange={emailReg.onChange}
            onBlur={emailReg.onBlur}
            inputRef={emailReg.ref}
            fullWidth
          />

          <Box>
            <Stack
              direction="row"
              sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography
                component="label"
                htmlFor="password"
                variant="labelMd"
                color="text.secondary"
              >
                Password
              </Typography>
              <Typography
                component={RouterLink}
                to={ROUTES.FORGOT_PASSWORD}
                variant="labelSm"
                color="primary"
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.dark' },
                }}
              >
                Forgot password?
              </Typography>
            </Stack>
            <TextField
              fullWidth
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              error={!!errors.password}
              helperText={errors.password?.message}
              name={passwordReg.name}
              onChange={passwordReg.onChange}
              onBlur={passwordReg.onBlur}
              inputRef={passwordReg.ref}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <MaterialSymbol
                          name={showPassword ? 'visibility_off' : 'visibility'}
                          sx={{ fontSize: 20 }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <FormControlLabel
            control={<Checkbox disabled={isSubmitting} {...rememberReg} />}
            label={
              <Typography variant="bodySm" color="text.secondary">
                Remember me for 30 days
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting || authLoading}
            sx={{ py: 2, fontWeight: 700 }}
          >
            {(isSubmitting || authLoading) ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Sign in'
            )}
          </Button>
        </Stack>
      </Box>
    </>
  )
}
