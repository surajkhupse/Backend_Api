import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { APP_BRAND_NAME } from '../../constants'
import { authMeshBackground, ThemeModeToggle } from '../../theme'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const FOOTER_LINKS = [
  { label: 'Help Center', href: '#' },
  { label: 'Security', href: '#' },
  { label: 'System Status', href: '#' },
] as const

export function ForgotPasswordPage() {
  return (
    <Box
      sx={(theme) => ({
        ...authMeshBackground(theme.palette.mode),
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
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
          maxWidth: 480,
          animation: 'auth-fade-in 0.4s ease-out',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="headlineLg" color="primary.main" gutterBottom>
            {APP_BRAND_NAME}
          </Typography>
          <Typography variant="bodyMd" color="text.secondary">
            Elevate your enterprise event operations.
          </Typography>
        </Box>

        <Paper
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'border.subtle',
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            boxShadow: '0 8px 30px rgb(0 0 0 / 0.04)',
          }}
        >
          <ForgotPasswordForm />
        </Paper>

        <Stack
          direction="row"
          spacing={3}
          sx={{
            mt: 4,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              underline="none"
              variant="labelSm"
              color="text.disabled"
              sx={{ '&:hover': { color: 'text.secondary' } }}
              onClick={(e) => e.preventDefault()}
            >
              {item.label}
            </Link>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
