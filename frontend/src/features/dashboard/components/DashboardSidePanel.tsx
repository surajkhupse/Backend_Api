import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { MaterialSymbol } from '../../../theme'
import { QUICK_REPORTS } from '../data/dashboardMockData'

export function DashboardSidePanel() {
  return (
    <Stack spacing={3} sx={{ gridColumn: { lg: 'span 4' } }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: (theme) => `0 12px 32px ${theme.palette.primary.main}40`,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="headlineMd" gutterBottom>
            Create New Event
          </Typography>
          <Typography variant="bodySm" sx={{ opacity: 0.9, mb: 3 }}>
            Launch a new session, webinar, or physical conference in minutes.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              bgcolor: 'common.white',
              color: 'primary.main',
              fontWeight: 500,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
            startIcon={<MaterialSymbol name="add_circle" sx={{ fontSize: 20 }} />}
          >
            Start Setup
          </Button>
        </Box>
        <MaterialSymbol
          name="rocket_launch"
          sx={{
            position: 'absolute',
            right: -16,
            bottom: -16,
            fontSize: 120,
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3, border: 1, borderColor: 'border.subtle', borderRadius: 3 }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
          <MaterialSymbol name="download" sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="labelMd" color="text.secondary">
            Quick Reports
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          {QUICK_REPORTS.map((label) => (
            <Button
              key={label}
              fullWidth
              variant="outlined"
              color="inherit"
              sx={{
                justifyContent: 'space-between',
                py: 1.5,
                px: 2,
                borderColor: 'transparent',
                color: 'text.primary',
                fontWeight: 400,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'background.containerLow',
                  borderColor: 'border.subtle',
                },
              }}
              endIcon={<MaterialSymbol name="file_download" sx={{ fontSize: 18 }} />}
            >
              <Typography variant="bodySm">{label}</Typography>
            </Button>
          ))}
        </Stack>
      </Paper>
    </Stack>
  )
}
