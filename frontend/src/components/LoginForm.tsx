import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
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
import { ROUTES } from '../routes/paths'
import { useAppDispatch } from '../store/hooks'
import { setTokens } from '../store/slices/authSlice'
import {
  getLoginErrorMessage,
  isAccountLockedError,
  loginRequest,
} from '../services/api/auth'
import { loginFormSchema, type LoginFormValues } from '../schemas/loginFormSchema'
import { googleSsoStartUrl } from '../utils/apiBaseUrl'
import {
  MaterialSymbol,
  authFormSpacing,
  authLinkSubtleSx,
  authSubmitButtonSx,
  dividerLabelSx,
  dividerWithLabelSx,
  googleSignInButtonSx,
} from '../theme'
import { GoogleLogo } from './GoogleLogo'

export type LoginFormProps = {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch()
  const [apiError, setApiError] = useState<string | null>(null)
  const [lockUntil, setLockUntil] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const ssoUrl = googleSsoStartUrl()

  function handleGoogleSignIn() {
    if (!ssoUrl) {
      setApiError('API URL is not configured. Set VITE_API_URL in your environment.')
      return
    }
    window.location.href = ssoUrl
  }

  async function onSubmit(data: LoginFormValues) {
    setApiError(null)
    setLockUntil(null)
    try {
      const payload = await loginRequest({
        email: data.email,
        password: data.password,
      })
      dispatch(
        setTokens({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          rememberMe: data.rememberMe ?? false,
        }),
      )
      onSuccess?.()
    } catch (err) {
      if (isAccountLockedError(err)) {
        const body = err.response?.data
        if (body) {
          setLockUntil(body.lockUntil)
          setApiError(body.message)
        } else {
          setApiError(getLoginErrorMessage(err))
        }
      } else {
        setApiError(getLoginErrorMessage(err))
      }
    }
  }

  const emailReg = register('email')
  const passwordReg = register('password')
  const rememberReg = register('rememberMe')

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        fullWidth
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        startIcon={<GoogleLogo width={20} height={20} />}
        sx={googleSignInButtonSx}
      >
        Sign in with Google
      </Button>

      <Divider sx={dividerWithLabelSx}>
        <Typography variant="labelSm" sx={dividerLabelSx}>
          or continue with email
        </Typography>
      </Divider>

      {(apiError || lockUntil) && (
        <Alert
          severity={lockUntil ? 'warning' : 'error'}
          sx={{ mb: 0 }}
        >
          {apiError}
          {lockUntil && (
            <Typography variant="labelSm" sx={{ mt: 1, display: 'block', opacity: 0.9 }}>
              Unlocks after{' '}
              {new Date(lockUntil).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Typography>
          )}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={authFormSpacing}>
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
          />

          <Box>
            <Stack direction="row" sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}>
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
                sx={authLinkSubtleSx}
              >
                Forgot password?
              </Typography>
            </Stack>
            <TextField
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
            control={
              <Checkbox disabled={isSubmitting} {...rememberReg} />
            }
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
            disabled={isSubmitting}
            sx={authSubmitButtonSx}
          >
            {isSubmitting ? (
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
