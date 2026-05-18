import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '../routes/paths'
import { authLinkSx, authMainSx, authPageSx } from '../theme'

type Props = {
  title: string
  description: string
}

export function AuthPlaceholderPage({ title, description }: Props) {
  return (
    <Box sx={authPageSx}>
      <Box component="main" sx={{ ...authMainSx, textAlign: 'center' }}>
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
          sx={authLinkSx}
        >
          Back to sign in
        </Typography>
      </Box>
    </Box>
  )
}
