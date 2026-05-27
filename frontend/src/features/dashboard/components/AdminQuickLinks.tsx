import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '../../../routes/paths'
import { MaterialSymbol } from '../../../theme'

type AdminQuickLinksProps = {
  tenantCount: number
  userCount: number
}

export function AdminQuickLinks({ tenantCount, userCount }: AdminQuickLinksProps) {
  const links = [
    {
      title: 'Tenants',
      description: 'View and create all organizations',
      count: tenantCount,
      countLabel: 'tenants',
      icon: 'domain',
      path: ROUTES.TENANTS,
    },
    {
      title: 'Users',
      description: 'View all registered platform users',
      count: userCount,
      countLabel: 'users',
      icon: 'group',
      path: ROUTES.USERS,
    },
  ] as const

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2,
      }}
    >
      {links.map((link) => (
        <Paper
          key={link.path}
          elevation={0}
          sx={{
            p: 3,
            border: 1,
            borderColor: 'border.subtle',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <MaterialSymbol name={link.icon} sx={{ fontSize: 28, color: 'primary.main' }} />
            <Box>
              <Typography variant="titleMd">{link.title}</Typography>
              <Typography variant="bodySm" color="text.secondary">
                {link.count} {link.countLabel}
              </Typography>
            </Box>
          </Box>
          <Typography variant="bodySm" color="text.secondary">
            {link.description}
          </Typography>
          <Button
            component={RouterLink}
            to={link.path}
            variant="contained"
            endIcon={<MaterialSymbol name="arrow_forward" sx={{ fontSize: 18 }} />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Open {link.title}
          </Button>
        </Paper>
      ))}
    </Box>
  )
}
