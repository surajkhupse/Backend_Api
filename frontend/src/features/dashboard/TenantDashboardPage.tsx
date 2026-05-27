import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { DashboardStatCards } from './components'
import { TENANT_DASHBOARD_STATS } from './data/dashboardMockData'
import { layout } from '../../theme/tokens/spacing'

export function TenantDashboardPage() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        p: { xs: 2, md: 4 },
        maxWidth: layout.maxContainerWidth,
        width: 1,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="headlineMd">Tenant Dashboard</Typography>
        <Typography variant="bodyMd" color="text.secondary">
          View your tenant health, member activity, and upcoming operations.
        </Typography>
      </Stack>

      <DashboardStatCards stats={TENANT_DASHBOARD_STATS} />

      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="titleMd">Next Step</Typography>
        <Typography variant="bodySm" color="text.secondary" sx={{ mt: 1 }}>
          Connect this page with tenant-specific APIs like members, usage, and events.
        </Typography>
      </Card>
    </Box>
  )
}
