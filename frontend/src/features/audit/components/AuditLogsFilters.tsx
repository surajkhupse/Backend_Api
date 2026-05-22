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
import { MaterialSymbol } from '../../../theme'
import type { AuditActionFilter } from '../types'

export type AuditLogsFiltersProps = {
  actionFilter: AuditActionFilter
  onActionFilterChange: (value: AuditActionFilter) => void
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  resultCount: number
  totalCount: number
  onClear: () => void
}

const ACTION_OPTIONS: { value: AuditActionFilter; label: string }[] = [
  { value: 'all', label: 'All actions' },
  { value: 'LOGIN_SUCCESS', label: 'Successful sign-in' },
  { value: 'LOGIN_FAILURE', label: 'Failed sign-in' },
  { value: 'LOGIN_LOCKED', label: 'Account locked' },
  { value: 'LOGIN_SSO_SUCCESS', label: 'Google sign-in' },
]

export function AuditLogsFilters({
  actionFilter,
  onActionFilterChange,
  searchQuery,
  onSearchQueryChange,
  resultCount,
  totalCount,
  onClear,
}: AuditLogsFiltersProps) {
  const hasActiveFilters = actionFilter !== 'all' || searchQuery.trim().length > 0

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: 1,
        borderColor: 'border.subtle',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Search by IP, action, target, or date…"
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        aria-label="Search audit logs"
        sx={{
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
                  onClick={() => onSearchQueryChange('')}
                  edge="end"
                >
                  <MaterialSymbol name="close" sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel id="audit-action-filter">Action type</InputLabel>
          <Select
            labelId="audit-action-filter"
            label="Action type"
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value as AuditActionFilter)}
          >
            {ACTION_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ ml: { sm: 'auto' }, display: 'flex', alignItems: 'center', gap: 2 }}>
          {hasActiveFilters && (
            <Typography variant="labelSm" color="text.secondary">
              {resultCount} of {totalCount} entries
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
