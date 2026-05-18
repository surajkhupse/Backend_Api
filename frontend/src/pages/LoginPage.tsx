import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { APP_BRAND_NAME } from '../constants'
import { ROUTES } from '../routes/paths'
import { authMeshBackground, MaterialSymbol, ThemeModeToggle } from '../theme'

export function LoginPage() {
  const navigate = useNavigate()

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
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 3,
              mb: 3,
            }}
          >
            <MaterialSymbol name="event_available" filled sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="headlineLg" color="text.primary" gutterBottom>
            {APP_BRAND_NAME}
          </Typography>
          <Typography variant="bodyMd" color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        <Paper
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'border.subtle',
            borderRadius: 1.5,
            p: 4,
            boxShadow: '0 8px 30px rgb(0 0 0 / 0.04)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <LoginForm onSuccess={() => navigate(ROUTES.HOME, { replace: true })} />
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
