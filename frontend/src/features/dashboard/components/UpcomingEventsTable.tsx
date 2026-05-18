import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { MaterialSymbol } from '../../../theme'
import { DASHBOARD_ACCENT } from '../constants/dashboard'
import { UPCOMING_EVENTS } from '../data/dashboardMockData'
import type { UpcomingEvent } from '../data/dashboardMockData'

function StatusChip({ status }: { status: UpcomingEvent['status'] }) {
  if (status === 'draft') {
    return (
      <Chip
        label="Draft"
        size="small"
        sx={{
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          bgcolor: `${DASHBOARD_ACCENT.tertiaryContainer}33`,
          color: DASHBOARD_ACCENT.tertiary,
          border: `1px solid ${DASHBOARD_ACCENT.tertiary}4D`,
        }}
      />
    )
  }

  return (
    <Chip
      label="Confirmed"
      size="small"
      color="secondary"
      variant="outlined"
      sx={{
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        bgcolor: (theme) => `${theme.palette.secondary.light}33`,
        borderColor: (theme) => `${theme.palette.secondary.main}4D`,
        color: 'secondary.main',
      }}
    />
  )
}

export function UpcomingEventsTable() {
  return (
    <Paper
      elevation={0}
      sx={{
        gridColumn: '1 / -1',
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: 'border.subtle',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="headlineMd">Upcoming Events</Typography>
        <Typography
          component="button"
          variant="labelMd"
          color="primary.main"
          sx={{
            border: 0,
            bgcolor: 'transparent',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View All
        </Typography>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.containerLow' }}>
              {['Event Name', 'Date', 'Status', 'Registrations', 'Action'].map((col) => (
                <TableCell key={col}>
                  <Typography variant="labelMd" color="text.secondary">
                    {col}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {UPCOMING_EVENTS.map((event) => (
              <TableRow
                key={event.id}
                hover
                sx={{ '&:last-child td': { borderBottom: 0 } }}
              >
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Avatar
                      variant="rounded"
                      src={event.imageUrl}
                      alt={event.name}
                      sx={{ width: 40, height: 40, borderRadius: 2 }}
                    />
                    <Box>
                      <Typography variant="bodyMd" sx={{ fontWeight: 600 }}>
                        {event.name}
                      </Typography>
                      <Typography variant="labelSm" color="text.secondary">
                        {event.subtitle}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="bodySm">{event.date}</Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={event.status} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'baseline' }}>
                    <Typography variant="bodySm" sx={{ fontWeight: 600 }}>
                      {event.registrations.toLocaleString()}
                    </Typography>
                    <Typography variant="labelSm" color="text.secondary">
                      / {event.capacity.toLocaleString()}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <IconButton size="small" aria-label="More actions">
                    <MaterialSymbol name="more_horiz" sx={{ color: 'text.secondary' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
