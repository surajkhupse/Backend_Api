import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '../../routes/paths'
import { MaterialSymbol } from '../../theme'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { forgotPassword } from '../../store/slices/forgotPasswordSlice'
import { forgotPasswordSchema, type ForgotPasswordValues } from './forgotPasswordSchema'

export function ForgotPasswordForm() {
  const dispatch = useAppDispatch()
  const { loading, error: apiError, submitted, submittedEmail } = useAppSelector((state) => state.forgotPassword)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotPasswordValues) {
    dispatch(forgotPassword(data.email))
  }

  const emailReg = register('email')

  if (submitted) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <MaterialSymbol name="mark_email_read" sx={{ fontSize: 28, color: 'common.white' }} />
        </Box>

        <Typography variant="headlineMd" color="text.primary" gutterBottom>
          Check your inbox
        </Typography>

        <Typography variant="bodySm" color="text.secondary" sx={{ mb: 1 }}>
          We sent password reset instructions to
        </Typography>
        <Typography variant="labelMd" color="text.primary" sx={{ mb: 3, wordBreak: 'break-all' }}>
          {submittedEmail}
        </Typography>

        <Alert severity="info" variant="outlined" sx={{ mb: 3, textAlign: 'left' }}>
          If you don't see the email, check your spam folder. The link expires in 1 hour.
        </Alert>

        <Stack spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            disabled={isSubmitting || loading}
            onClick={handleSubmit(onSubmit)}
            sx={{ py: 1.5 }}
          >
            Resend email
          </Button>

          <Typography variant="bodySm" color="text.secondary">
            <Typography
              component={RouterLink}
              to={ROUTES.LOGIN}
              variant="labelMd"
              color="primary"
              sx={{
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Back to sign in
            </Typography>
          </Typography>
        </Stack>
      </Box>
    )
  }

  return (
    <>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography variant="headlineMd" color="text.primary" gutterBottom>
          Forgot your password?
        </Typography>
        <Typography variant="bodySm" color="text.secondary">
          Enter the email address associated with your account and we'll send you a link to reset
          your password.
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
            id="forgot_email"
            label="Email address"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            autoFocus
            disabled={isSubmitting}
            error={!!errors.email}
            helperText={errors.email?.message}
            name={emailReg.name}
            onChange={emailReg.onChange}
            onBlur={emailReg.onBlur}
            inputRef={emailReg.ref}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting || loading}
            sx={{
              py: 1.5,
              fontWeight: 600,
              boxShadow: (theme) => theme.vars.customShadows.primary,
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            {(isSubmitting || loading) ? <CircularProgress size={22} color="inherit" /> : 'Send reset link'}
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
          Remember your password?{' '}
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
            Sign in
          </Typography>
        </Typography>
      </Box>
    </>
  )
}
