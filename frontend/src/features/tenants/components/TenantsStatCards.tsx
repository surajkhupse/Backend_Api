import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { TenantRecord } from '../../../services/api/tenantsApi'

type TenantsStatCardsProps = {
  tenants: TenantRecord[]
}

export function TenantsStatCards({ tenants }: TenantsStatCardsProps) {
  const active = tenants.filter((t) => t.status === 'active').length
  const suspended = tenants.filter((t) => t.status === 'suspended').length
  const inactive = tenants.filter((t) => t.status === 'inactive').length

  const stats = [
    { label: 'Total tenants', value: tenants.length },
    { label: 'Active', value: active },
    { label: 'Suspended', value: suspended },
    { label: 'Inactive', value: inactive },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <Paper
          key={stat.label}
          elevation={0}
          sx={{
            p: 2.5,
            border: 1,
            borderColor: 'border.subtle',
            borderRadius: 2,
          }}
        >
          <Typography variant="labelMd" color="text.secondary">
            {stat.label}
          </Typography>
          <Typography variant="headlineMd" sx={{ mt: 0.5 }}>
            {stat.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}
