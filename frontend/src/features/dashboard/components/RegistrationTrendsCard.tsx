import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

const CHART_LABELS = ['01 OCT', '08 OCT', '15 OCT', '22 OCT', '31 OCT'] as const

export function RegistrationTrendsCard() {
  const [range, setRange] = useState<'month' | 'year'>('month')

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gridColumn: { lg: 'span 8' },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: 'border.subtle',
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
        }}
      >
        <Box>
          <Typography variant="headlineMd">Registration Trends</Typography>
          <Typography variant="bodySm" color="text.secondary">
            Daily registrations for the current month
          </Typography>
        </Box>
        <ButtonGroup
          size="small"
          sx={{
            bgcolor: 'background.containerLow',
            p: 0.5,
            borderRadius: 2,
            '& .MuiButton-root': { border: 0, textTransform: 'none', minWidth: 64 },
          }}
        >
          <Button
            variant={range === 'month' ? 'contained' : 'text'}
            onClick={() => setRange('month')}
            sx={
              range === 'month'
                ? { bgcolor: 'background.paper', color: 'primary.main', boxShadow: 1 }
                : { color: 'text.secondary' }
            }
          >
            Month
          </Button>
          <Button
            variant={range === 'year' ? 'contained' : 'text'}
            onClick={() => setRange('year')}
            sx={
              range === 'year'
                ? { bgcolor: 'background.paper', color: 'primary.main', boxShadow: 1 }
                : { color: 'text.secondary' }
            }
          >
            Year
          </Button>
        </ButtonGroup>
      </Stack>

      <Box sx={{ position: 'relative', flex: 1, minHeight: 300, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            opacity: 0.2,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} sx={{ borderBottom: 1, borderColor: 'divider', width: 1 }} />
          ))}
        </Box>
        <Box
          component="svg"
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          sx={{ width: 1, flex: 1, color: 'primary.main' }}
        >
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity={1} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            d="M0,250 Q100,240 200,180 T400,120 T600,150 T800,80 T1000,40 V300 H0 Z"
            fill="url(#trendGradient)"
            opacity={0.1}
          />
          <path
            d="M0,250 Q100,240 200,180 T400,120 T600,150 T800,80 T1000,40"
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </Box>
        <Stack direction="row" sx={{ mt: 2, justifyContent: 'space-between' }}>
          {CHART_LABELS.map((label) => (
            <Typography key={label} variant="mono" color="text.secondary">
              {label}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Paper>
  )
}
