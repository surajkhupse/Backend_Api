import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { APP_BRAND_NAME } from '../constants'
import { ROUTES } from '../routes/paths'
import {
  MaterialSymbol,
  authBrandBlockSx,
  authBrandIconSx,
  authCardSx,
  authFooterTextSx,
  authLinkSx,
  authMainSx,
  authPageSx,
  authStatusDotSx,
  authStatusRowSx,
  supportFabSx,
} from '../theme'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <Box sx={authPageSx}>
      <Box component="main" sx={authMainSx}>
        <Box sx={authBrandBlockSx}>
          <Box sx={authBrandIconSx}>
            <MaterialSymbol name="event_available" filled sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="headlineLg" color="text.primary" gutterBottom>
            {APP_BRAND_NAME}
          </Typography>
          <Typography variant="bodyMd" color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        <Paper sx={authCardSx}>
          <LoginForm onSuccess={() => navigate(ROUTES.HOME, { replace: true })} />
        </Paper>

        <Typography variant="bodySm" color="text.secondary" sx={authFooterTextSx}>
          Don&apos;t have an account?{' '}
          <Typography
            component={RouterLink}
            to={ROUTES.SIGN_UP}
            variant="labelMd"
            color="primary"
            sx={authLinkSx}
          >
            Sign up for free
          </Typography>
        </Typography>

        <Stack direction="row" sx={authStatusRowSx}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={authStatusDotSx} />
            <Typography variant="labelSm" color="text.disabled">
              System operational
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <MaterialSymbol name="lock" sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="labelSm" color="text.disabled">
              Secure 256-bit SSL
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Button type="button" sx={supportFabSx}>
        <MaterialSymbol name="help_outline" sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="labelMd" color="text.secondary">
          Support
        </Typography>
      </Button>
    </Box>
  )
}
