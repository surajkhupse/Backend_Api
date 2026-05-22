import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
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
import type { AuditLogEntry } from '../types'
import {
  formatAuditTimestamp,
  presentAuditLogEntry,
  type AuditStatusTone,
} from '../utils/auditLogPresentation'
import { AuditLogsPagination } from './AuditLogsPagination'

function StatusChip({ label, tone }: { label: string; tone: AuditStatusTone }) {
  const styles =
    tone === 'success'
      ? { bgcolor: 'success.light', color: 'success.dark' }
      : tone === 'warning'
        ? { bgcolor: 'error.light', color: 'error.dark' }
        : { bgcolor: 'info.light', color: 'info.dark' }

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        ...styles,
      }}
    />
  )
}

export type AuditLogsTableProps = {
  entries: AuditLogEntry[]
  totalCount: number
  page: number
  onPageChange: (page: number) => void
  userLabel?: string
  userSubLabel?: string
}

export function AuditLogsTable({
  entries,
  totalCount,
  page,
  onPageChange,
  userLabel = 'You',
  userSubLabel = 'Your account activity',
}: AuditLogsTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.containerLow' }}>
              {['Timestamp', 'User', 'Action', 'Target', 'IP address', 'Status'].map((h, i) => (
                <TableCell
                  key={h}
                  align={i === 5 ? 'right' : 'left'}
                  sx={{
                    py: 2,
                    px: 3,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    borderColor: 'border.subtle',
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center' }}>
                  <Typography color="text.secondary">No audit entries match your filters.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => {
                const row = presentAuditLogEntry(entry)
                return (
                  <TableRow
                    key={entry.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <TableCell
                      sx={{
                        px: 3,
                        py: 2,
                        fontFamily: 'monospace',
                        fontSize: 13,
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatAuditTimestamp(entry.createdAt)}
                    </TableCell>
                    <TableCell sx={{ px: 3, py: 2, whiteSpace: 'nowrap' }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: 10,
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                          }}
                        >
                          {userLabel.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="labelMd">{userLabel}</Typography>
                          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                            {userSubLabel}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ px: 3, py: 2 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <MaterialSymbol name={row.icon} sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="bodySm">{row.label}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ px: 3, py: 2 }}>
                      <Typography variant="bodySm" color="text.secondary">
                        {row.target}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        px: 3,
                        py: 2,
                        fontFamily: 'monospace',
                        fontSize: 12,
                        color: 'text.secondary',
                      }}
                    >
                      {entry.ipAddress || '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ px: 3, py: 2 }}>
                      <StatusChip label={row.statusLabel} tone={row.statusTone} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AuditLogsPagination page={page} totalItems={totalCount} onPageChange={onPageChange} />
    </Paper>
  )
}
