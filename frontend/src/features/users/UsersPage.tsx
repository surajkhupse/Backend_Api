import { useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearUsersError, listUsers } from '../../store/slices/usersSlice'
import { MaterialSymbol } from '../../theme'
import { layout } from '../../theme/tokens/spacing'
import { UsersFilters, type UserRoleFilter } from './components/UsersFilters'
import { UsersTable } from './components/UsersTable'

export function UsersPage() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((state) => state.users)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all')
  const debouncedSearch = useDebouncedValue(search, 300)

  useEffect(() => {
    dispatch(listUsers())
  }, [dispatch])

  const filteredUsers = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return items.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.tenantName?.toLowerCase().includes(q) ?? false)
      return matchesRole && matchesSearch
    })
  }, [items, debouncedSearch, roleFilter])

  function handleRefresh() {
    dispatch(clearUsersError())
    dispatch(listUsers())
  }

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 2, md: 4 },
        maxWidth: layout.maxContainerWidth,
        width: 1,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="headlineLg" sx={{ fontWeight: 600 }}>
            Users
          </Typography>
          <Typography variant="bodyMd" color="text.secondary" sx={{ mt: 0.5 }}>
            All platform users — assign owners when creating tenants.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={loading}
          startIcon={<MaterialSymbol name="refresh" />}
        >
          Refresh
        </Button>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearUsersError())}>
          {error}
        </Alert>
      ) : null}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <UsersFilters
          search={search}
          roleFilter={roleFilter}
          resultCount={filteredUsers.length}
          onSearchChange={setSearch}
          onRoleFilterChange={setRoleFilter}
          onClear={() => {
            setSearch('')
            setRoleFilter('all')
          }}
        />

        <Paper
          elevation={0}
          sx={{ border: 1, borderColor: 'border.subtle', borderRadius: 3, overflow: 'hidden' }}
        >
          {loading && items.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <UsersTable users={filteredUsers} />
          )}
        </Paper>
      </Box>
    </Box>
  )
}
