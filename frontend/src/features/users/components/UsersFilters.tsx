import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { UserRole } from '../../../services/api/userNormalize'
import { MaterialSymbol } from '../../../theme'

export type UserRoleFilter = 'all' | UserRole

type UsersFiltersProps = {
  search: string
  roleFilter: UserRoleFilter
  resultCount: number
  onSearchChange: (value: string) => void
  onRoleFilterChange: (value: UserRoleFilter) => void
  onClear: () => void
}

export function UsersFilters({
  search,
  roleFilter,
  resultCount,
  onSearchChange,
  onRoleFilterChange,
  onClear,
}: UsersFiltersProps) {
  const hasFilters = search.trim().length > 0 || roleFilter !== 'all'

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Search name or email…"
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
        <InputLabel id="user-role-filter">Role</InputLabel>
        <Select
          labelId="user-role-filter"
          label="Role"
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value as UserRoleFilter)}
        >
          <MenuItem value="all">All roles</MenuItem>
          <MenuItem value="superadmin">Superadmin</MenuItem>
          <MenuItem value="tenant_admin">Tenant admin</MenuItem>
          <MenuItem value="member">Member</MenuItem>
          <MenuItem value="viewer">Viewer</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="bodySm" color="text.secondary" sx={{ flex: 1 }}>
        {resultCount} user{resultCount === 1 ? '' : 's'}
      </Typography>
      {hasFilters ? (
        <Button size="small" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </Box>
  )
}
