import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import {
  getRegisterErrorMessage,
  loginRequest,
  registerRequest,
} from '../auth'
import { ROUTES } from '../../routes/paths'
import { useAppDispatch } from '../../store/hooks'
import { setTokens } from '../../store/slices/authSlice'
import { MaterialSymbol } from '../../theme'
import { getPasswordStrength } from './passwordStrength'
import { registerFormSchema, type RegisterFormValues } from './registerFormSchema'

export type RegisterFormProps = {
  onSuccess?: () => void
}

function buildDisplayName(fullName: string, companyName: string): string {
  return `${fullName} · ${companyName}`
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const dispatch = useAppDispatch()
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      password: '',
      acceptTerms: false,
    },
  })

  const passwordValue = watch('password') ?? ''
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue])

  async function onSubmit(data: RegisterFormValues) {
    setApiError(null)
    try {
      await registerRequest({
        name: buildDisplayName(data.fullName, data.companyName),
        email: data.email,
        password: data.password,
      })

      const tokens = await loginRequest({
        email: data.email,
        password: data.password,
      })

      dispatch(
        setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          rememberMe: false,
        }),
      )
      onSuccess?.()
    } catch (err) {
      setApiError(getRegisterErrorMessage(err))
    }
  }

  const fullNameReg = register('fullName')
  const emailReg = register('email')
  const companyReg = register('companyName')
  const passwordReg = register('password')
  const termsReg = register('acceptTerms')

  return (
    <>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography variant="headlineMd" color="text.primary" gutterBottom>
          Create an account
        </Typography>
        <Typography variant="bodySm" color="text.secondary">
          Join the leading platform for event professionals.
        </Typography>
      </Box>

      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {apiError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <TextField
            id="full_name"
            label="Full Name"
            placeholder="Alex Rivera"
            autoComplete="name"
            disabled={isSubmitting}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            name={fullNameReg.name}
            onChange={fullNameReg.onChange}
            onBlur={fullNameReg.onBlur}
            inputRef={fullNameReg.ref}
            fullWidth
          />

          <TextField
            id="work_email"
            label="Work Email"
            type="email"
            placeholder="alex@company.com"
            autoComplete="email"
            disabled={isSubmitting}
            error={!!errors.email}
            helperText={errors.email?.message}
            name={emailReg.name}
            onChange={emailReg.onChange}
            onBlur={emailReg.onBlur}
            inputRef={emailReg.ref}
            fullWidth
          />

          <TextField
            id="company_name"
            label="Company Name"
            placeholder="Acme Corp"
            autoComplete="organization"
            disabled={isSubmitting}
            error={!!errors.companyName}
            helperText={errors.companyName?.message}
            name={companyReg.name}
            onChange={companyReg.onChange}
            onBlur={companyReg.onBlur}
            inputRef={companyReg.ref}
            fullWidth
          />

          <Box>
            <Stack
              direction="row"
              sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography component="label" htmlFor="password" variant="labelMd" color="text.primary">
                Password
              </Typography>
              <Typography variant="labelSm" color="text.disabled">
                Min. 8 characters
              </Typography>
            </Stack>
            <TextField
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              error={!!errors.password}
              helperText={errors.password?.message}
              name={passwordReg.name}
              onChange={passwordReg.onChange}
              onBlur={passwordReg.onBlur}
              inputRef={passwordReg.ref}
              fullWidth
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

            {passwordValue.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                  {[1, 2, 3, 4].map((bar) => (
                    <Box
                      key={bar}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 9999,
                        bgcolor: bar <= strength.score ? 'primary.main' : 'divider',
                        transition: 'background-color 200ms ease',
                      }}
                    />
                  ))}
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant="labelSm"
                    color={strength.score >= 3 ? 'primary.main' : 'text.secondary'}
                  >
                    {strength.label}
                  </Typography>
                  {strength.score >= 4 && (
                    <MaterialSymbol name="check_circle" sx={{ fontSize: 16, color: 'primary.main' }} />
                  )}
                </Stack>
              </Box>
            )}
          </Box>

          <Box sx={{ py: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={isSubmitting}
                  {...termsReg}
                  checked={watch('acceptTerms') === true}
                />
              }
              sx={{ alignItems: 'flex-start', m: 0 }}
              label={
                <Typography variant="bodySm" color="text.secondary" sx={{ pt: 0.25 }}>
                  I agree to the{' '}
                  <Typography
                    component="a"
                    href="#"
                    variant="labelMd"
                    color="primary"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    onClick={(e) => e.preventDefault()}
                  >
                    Terms of Service
                  </Typography>{' '}
                  and{' '}
                  <Typography
                    component="a"
                    href="#"
                    variant="labelMd"
                    color="primary"
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    onClick={(e) => e.preventDefault()}
                  >
                    Privacy Policy
                  </Typography>
                  .
                </Typography>
              }
            />
            {errors.acceptTerms && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4.5 }}>
                {errors.acceptTerms.message}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              fontWeight: 600,
              boxShadow: (theme) => theme.vars.customShadows.primary,
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
          </Button>
        </Stack>
      </Box>

      <Box
        component="footer"
        sx={{
          mt: 4,
          pt: 4,
          borderTop: 1,
          borderColor: 'border.subtle',
          textAlign: 'center',
        }}
      >
        <Typography variant="bodySm" color="text.secondary">
          Already have an account?{' '}
          <Typography
            component={RouterLink}
            to={ROUTES.LOGIN}
            variant="labelMd"
            color="primary"
            sx={{
              fontWeight: 600,
              textDecoration: 'none',
              ml: 0.5,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Log in
          </Typography>
        </Typography>
      </Box>
    </>
  )
}
