import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { TenantRecord } from '../../../services/api/tenantsApi'
import type { UserRecord } from '../../../services/api/usersApi'

type AdminGrowthChartProps = {
  tenants: TenantRecord[]
  users: UserRecord[]
}

type MonthPoint = {
  key: string
  label: string
  tenantCount: number
  userCount: number
}

function toMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(date: Date): string {
  return date.toLocaleString(undefined, { month: 'short' })
}

function buildLastMonths(monthCount: number): MonthPoint[] {
  const now = new Date()
  const startMonth = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1), 1)
  const months: MonthPoint[] = []

  for (let i = 0; i < monthCount; i += 1) {
    const current = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1)
    months.push({
      key: monthKey(current),
      label: monthLabel(current),
      tenantCount: 0,
      userCount: 0,
    })
  }

  return months
}

function safeDate(value: string): Date | null {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function AdminGrowthChart({ tenants, users }: AdminGrowthChartProps) {
  const points = buildLastMonths(6)
  const pointsByKey = new Map(points.map((p) => [p.key, p]))

  for (const tenant of tenants) {
    const created = safeDate(tenant.createdAt)
    if (!created) continue
    const key = monthKey(toMonthStart(created))
    const point = pointsByKey.get(key)
    if (point) point.tenantCount += 1
  }

  for (const user of users) {
    const created = safeDate(user.createdAt)
    if (!created) continue
    const key = monthKey(toMonthStart(created))
    const point = pointsByKey.get(key)
    if (point) point.userCount += 1
  }

  const maxValue = Math.max(1, ...points.flatMap((p) => [p.tenantCount, p.userCount]))

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 3,
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 2.5 }}>
        <Typography variant="titleMd">Growth overview</Typography>
        <Typography variant="bodySm" color="text.secondary">
          Monthly created records for tenants and users (last 6 months).
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5, alignItems: 'center' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
          <Typography variant="labelSm" color="text.secondary">
            Tenants
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Typography variant="labelSm" color="text.secondary">
            Users
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 1.5 }}>
        {points.map((point) => {
          const tenantHeight = `${Math.max(8, (point.tenantCount / maxValue) * 120)}px`
          const userHeight = `${Math.max(8, (point.userCount / maxValue) * 120)}px`
          return (
            <Stack key={point.key} spacing={1} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'flex-end', minHeight: 120 }}>
                <Box
                  title={`Tenants: ${point.tenantCount}`}
                  sx={{
                    width: 12,
                    height: tenantHeight,
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                  }}
                />
                <Box
                  title={`Users: ${point.userCount}`}
                  sx={{
                    width: 12,
                    height: userHeight,
                    borderRadius: 1,
                    bgcolor: 'success.main',
                  }}
                />
              </Stack>
              <Typography variant="labelSm" color="text.secondary">
                {point.label}
              </Typography>
            </Stack>
          )
        })}
      </Box>
    </Paper>
  )
}
