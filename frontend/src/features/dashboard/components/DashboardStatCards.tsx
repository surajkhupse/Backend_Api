import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { MaterialSymbol } from '../../../theme'
import { DASHBOARD_ACCENT } from '../constants/dashboard'
import { TENANT_DASHBOARD_STATS, STAT_SPARKLINE_HEIGHTS } from '../data/dashboardMockData'
import type { DashboardStat } from '../data/dashboardMockData'

type DashboardStatCardsProps = {
  stats?: DashboardStat[]
}

function StatCardFooter({ variant }: { variant: DashboardStat['variant'] }) {
  if (variant === 'events') {
    return (
      <Stack direction="row" spacing={0.25} sx={{ mt: 2, height: 40, alignItems: 'flex-end' }}>
        {STAT_SPARKLINE_HEIGHTS.map((height, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              height: `${height}%`,
              borderRadius: '4px 4px 0 0',
              bgcolor: i === STAT_SPARKLINE_HEIGHTS.length - 1 ? 'primary.main' : 'primary.main',
              opacity: i === STAT_SPARKLINE_HEIGHTS.length - 1 ? 1 : 0.2,
            }}
          />
        ))}
      </Stack>
    )
  }

  if (variant === 'sessions') {
    return (
      <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: 'center' }}>
        <Stack direction="row" sx={{ '& > *': { ml: -1 } }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: 2,
                borderColor: 'background.paper',
                bgcolor: `grey.${300 + i * 100}`,
              }}
            />
          ))}
        </Stack>
        <Typography variant="labelSm" color="text.secondary">
          +820 viewers
        </Typography>
      </Stack>
    )
  }

  if (variant === 'registrations') {
    return (
      <Box
        sx={{
          mt: 3,
          height: 6,
          borderRadius: 9999,
          bgcolor: 'background.containerLow',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: '78%', height: '100%', bgcolor: 'secondary.main', borderRadius: 9999 }} />
      </Box>
    )
  }

  return (
    <Typography
      component="span"
      variant="mono"
      sx={{
        mt: 2,
        display: 'inline-block',
        px: 1,
        py: 0.25,
        borderRadius: 1,
        bgcolor: 'background.container',
        color: 'primary.main',
      }}
    >
      Q3 TARGET: 85%
    </Typography>
  )
}

function iconBgColor(variant: DashboardStat['variant']): string {
  switch (variant) {
    case 'events':
      return 'primary.main'
    case 'sessions':
      return DASHBOARD_ACCENT.tertiaryContainer
    case 'registrations':
      return 'secondary.light'
    default:
      return 'primary.light'
  }
}

function iconColor(variant: DashboardStat['variant']): string {
  switch (variant) {
    case 'sessions':
      return DASHBOARD_ACCENT.tertiary
    case 'registrations':
      return 'secondary.main'
    default:
      return 'primary.main'
  }
}

export function DashboardStatCards({ stats = TENANT_DASHBOARD_STATS }: DashboardStatCardsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
        gap: 3,
      }}
    >
      {stats.map((stat) => (
        <Paper
          key={stat.id}
          elevation={0}
          sx={{
            p: 3,
            border: 1,
            borderColor: 'border.subtle',
            borderRadius: 3,
            transition: 'transform 200ms ease',
            '&:hover': { transform: 'translateY(-2px)' },
          }}
        >
          <Stack
            direction="row"
            sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: `${iconBgColor(stat.variant)}14`,
                color: iconColor(stat.variant),
                display: 'flex',
              }}
            >
              <MaterialSymbol name={stat.icon} />
            </Box>
            {stat.trend && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Typography
                  variant="labelMd"
                  color={stat.trend.color === 'tertiary' ? undefined : 'secondary.main'}
                  sx={stat.trend.color === 'tertiary' ? { color: DASHBOARD_ACCENT.tertiary } : undefined}
                >
                  {stat.trend.label}
                </Typography>
                {stat.trend.icon && (
                  <MaterialSymbol name={stat.trend.icon} sx={{ fontSize: 16, color: 'secondary.main' }} />
                )}
              </Stack>
            )}
          </Stack>
          <Typography variant="labelMd" color="text.secondary">
            {stat.label}
          </Typography>
          <Typography variant="headlineLg" sx={{ mt: 0.5 }}>
            {stat.value}
          </Typography>
          <StatCardFooter variant={stat.variant} />
        </Paper>
      ))}
    </Box>
  )
}
