import Box from '@mui/material/Box'
import {
  DashboardSidePanel,
  DashboardStatCards,
  RegistrationTrendsCard,
  UpcomingEventsTable,
} from './components'
import { layout } from '../../theme/tokens/spacing'

export function DashboardPage() {
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
        gap: 4,
      }}
    >
      <DashboardStatCards />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' },
          gap: 3,
        }}
      >
        <RegistrationTrendsCard />
        <DashboardSidePanel />
        <UpcomingEventsTable />
      </Box>
    </Box>
  )
}

/** @deprecated Use `DashboardPage` */
export const HomePage = DashboardPage
