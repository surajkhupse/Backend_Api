import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { TopRightToast } from '../../components/TopRightToast'
import { useAuthRole } from '../auth/hooks/useAuthRole'
import { getDashboardHomeRoute } from '../auth/utils/dashboardRoutes'
import { isSuperadminRole } from '../auth/utils/jwt'
import { navigateAfterLogin } from '../../routes/authNavigation'
import { ROUTES } from '../../routes/paths'
import { useAppSelector } from '../../store/hooks'
import { authMeshBackground, MaterialSymbol, ThemeModeToggle } from '../../theme'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const auth = useAppSelector((state) => state.auth.tokens)
  const role = useAuthRole()
  const sessionExpired = searchParams.get('session') === 'expired'
  const [sessionToastDismissed, setSessionToastDismissed] = useState(false)

  const hasSession = Boolean(auth?.accessToken)
  const homeRoute = hasSession
    ? getDashboardHomeRoute(auth!.accessToken, role)
    : ROUTES.HOME

  return (
    <Box
      sx={(theme) => ({
        ...authMeshBackground(theme.palette.mode),
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 3 },
        position: 'relative',
      })}
    >
      <TopRightToast
        open={sessionExpired && !sessionToastDismissed}
        message="Your session expired. Please sign in again."
        severity="info"
        onClose={() => setSessionToastDismissed(true)}
      />

      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <ThemeModeToggle />
      </Box>
      <Box
        component="main"
        sx={{
          width: 1,
          maxWidth: 440,
          animation: 'auth-fade-in 0.4s ease-out',
        }}
      >
        <Paper
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'border.subtle',
            borderRadius: 1.5,
            p: 4,
            boxShadow: '0 8px 30px rgb(0 0 0 / 0.04)',
          }}
        >
          {hasSession && role ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="bodySm" component="div" sx={{ mb: 1.5 }}>
                Already signed in as <strong>{role}</strong>
                {isSuperadminRole(role) ? ' (platform admin)' : ' (tenant user)'}.
                Sign in again below to switch accounts.
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(homeRoute, { replace: true })}
              >
                Continue to dashboard
              </Button>
            </Alert>
          ) : null}

          <LoginForm onSuccess={(accessToken) => navigateAfterLogin(navigate, accessToken)} />
        </Paper>

        <Typography variant="bodySm" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Don&apos;t have an account?{' '}
          <Typography
            component={RouterLink}
            to={ROUTES.SIGN_UP}
            variant="labelMd"
            color="primary"
            sx={{
              fontWeight: 700,
              textDecoration: 'none',
              '&:hover': { color: 'primary.dark' },
            }}
          >
            Sign up for free
          </Typography>
        </Typography>

        <Stack
          direction="row"
          sx={{
            mt: 6,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'secondary.light',
              }}
            />
            <Typography variant="labelSm" color="text.disabled">
              System operational
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <MaterialSymbol name="lock" sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography variant="labelSm" color="text.disabled">
              Secure 256-bit SSL
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Button
        type="button"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'border.subtle',
          px: 2,
          py: 1,
          borderRadius: 9999,
          boxShadow: 1,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'background.containerLow' },
        }}
      >
        <MaterialSymbol name="help_outline" sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="labelMd" color="text.secondary">
          Support
        </Typography>
      </Button>
    </Box>
  )
}
