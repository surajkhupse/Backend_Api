import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '../../routes/paths'
import { authMeshBackground } from '../../theme'

type Props = {
  title: string
  description: string
}

export function AuthPlaceholderPage({ title, description }: Props) {
  return (
    <Box
      sx={(theme) => ({
        ...authMeshBackground(theme.palette.mode),
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 3 },
      })}
    >
      <Box
        component="main"
        sx={{
          width: 1,
          maxWidth: 440,
          textAlign: 'center',
          animation: 'auth-fade-in 0.4s ease-out',
        }}
      >
        <Typography variant="headlineLg" color="text.primary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="bodyMd" color="text.secondary" sx={{ mb: 4 }}>
          {description}
        </Typography>
        <Typography
          component={RouterLink}
          to={ROUTES.LOGIN}
          variant="labelMd"
          color="primary"
          sx={{
            fontWeight: 700,
            textDecoration: 'none',
            '&:hover': { color: 'primary.dark' },
          }}
        >
          Back to sign in
        </Typography>
      </Box>
    </Box>
  )
}
