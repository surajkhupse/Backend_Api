import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setAuditActionFilter, setAuditSearchQuery } from '../../../store/slices/auditSlice'
import { MaterialSymbol } from '../../../theme'
import type { AuditActionFilter } from '../types'

export type AuditLogsFiltersProps = {
  resultCount: number
  onClear: () => void
}

const ACTION_OPTIONS: { value: AuditActionFilter; label: string }[] = [
  { value: 'all', label: 'All actions' },
  { value: 'LOGIN_SUCCESS', label: 'Successful sign-in' },
  { value: 'LOGIN_FAILURE', label: 'Failed sign-in' },
  { value: 'LOGIN_LOCKED', label: 'Account locked' },
  { value: 'LOGIN_SSO_SUCCESS', label: 'Google sign-in' },
]

export function AuditLogsFilters({ resultCount, onClear }: AuditLogsFiltersProps) {
  const dispatch = useAppDispatch()
  const actionFilter = useAppSelector((state) => state.audit.actionFilter)
  const searchQuery = useAppSelector((state) => state.audit.searchQuery)
  const hasActiveFilters = actionFilter !== 'all' || searchQuery.trim().length > 0

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <TextField
          size="small"
          placeholder="Search by IP, action, or user-agent…"
          value={searchQuery}
          onChange={(e) => dispatch(setAuditSearchQuery(e.target.value))}
          aria-label="Search audit logs"
          sx={{
            flex: 1,
            minWidth: 0,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.containerLow',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MaterialSymbol name="search" sx={{ fontSize: 22, color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Clear search"
                    onClick={() => dispatch(setAuditSearchQuery(''))}
                    edge="end"
                  >
                    <MaterialSymbol name="close" sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: { xs: 1, sm: 220 }, flexShrink: 0 }}>
          <InputLabel id="audit-action-filter">Action type</InputLabel>
          <Select
            labelId="audit-action-filter"
            label="Action type"
            value={actionFilter}
            onChange={(e) => dispatch(setAuditActionFilter(e.target.value as AuditActionFilter))}
          >
            {ACTION_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
            gap: 2,
            flexShrink: 0,
          }}
        >
          {hasActiveFilters && (
            <Typography variant="labelSm" color="text.secondary" noWrap>
              {resultCount} {resultCount === 1 ? 'entry' : 'entries'}
            </Typography>
          )}
          <Button size="small" onClick={onClear} disabled={!hasActiveFilters} sx={{ fontWeight: 500 }}>
            Clear all
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
