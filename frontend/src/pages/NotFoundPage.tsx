import { Box, Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '../routes/paths'

export function NotFoundPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1">
        Page not found
      </Typography>
      <Typography color="text.secondary">
        The page you requested does not exist.
      </Typography>
      <Button component={RouterLink} to={ROUTES.HOME} variant="contained">
        Go home
      </Button>
    </Box>
  )
}
