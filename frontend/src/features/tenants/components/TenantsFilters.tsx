import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { TenantStatus } from '../../../services/api/tenantsApi'
import { MaterialSymbol } from '../../../theme'

export type TenantStatusFilter = 'all' | TenantStatus

type TenantsFiltersProps = {
  search: string
  statusFilter: TenantStatusFilter
  resultCount: number
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: TenantStatusFilter) => void
  onClear: () => void
}

export function TenantsFilters({
  search,
  statusFilter,
  resultCount,
  onSearchChange,
  onStatusFilterChange,
  onClear,
}: TenantsFiltersProps) {
  const hasFilters = search.trim().length > 0 || statusFilter !== 'all'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <TextField
        size="small"
        placeholder="Search by name or slug…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: { xs: 1, sm: 280 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <MaterialSymbol name="search" sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="tenant-status-filter">Status</InputLabel>
        <Select
          labelId="tenant-status-filter"
          label="Status"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as TenantStatusFilter)}
        >
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="suspended">Suspended</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="bodySm" color="text.secondary" sx={{ flex: 1 }}>
        {resultCount} tenant{resultCount === 1 ? '' : 's'}
      </Typography>

      {hasFilters ? (
        <Button size="small" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </Box>
  )
}
