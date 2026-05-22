import { useCallback, useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { MaterialSymbol } from '../../theme'
import { layout } from '../../theme/tokens/spacing'
import { fetchMyAuditLogs, getAuditLogsErrorMessage } from './api/auditLogs'
import { AuditLogsEmptyState } from './components/AuditLogsEmptyState'
import { AuditLogsFilters } from './components/AuditLogsFilters'
import { getAuditLogPageCount, paginateAuditLogs } from './components/AuditLogsPagination'
import { AuditLogsStatCards } from './components/AuditLogsStatCards'
import { AuditLogsTable } from './components/AuditLogsTable'
import type { AuditActionFilter, AuditLogEntry } from './types'
import { exportAuditLogsCsv } from './utils/auditLogPresentation'
import { filterAuditLogs } from './utils/filterAuditLogs'

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionFilter, setActionFilter] = useState<AuditActionFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const loadLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMyAuditLogs(100)
      setLogs(data)
      setPage(1)
    } catch (err) {
      setError(getAuditLogsErrorMessage(err))
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  const filteredLogs = useMemo(
    () => filterAuditLogs(logs, actionFilter, searchQuery),
    [logs, actionFilter, searchQuery],
  )

  useEffect(() => {
    setPage(1)
  }, [actionFilter, searchQuery])

  useEffect(() => {
    const maxPage = getAuditLogPageCount(filteredLogs.length)
    if (page > maxPage) setPage(maxPage)
  }, [filteredLogs.length, page])

  const pagedLogs = useMemo(() => paginateAuditLogs(filteredLogs, page), [filteredLogs, page])

  const hasFilters = actionFilter !== 'all' || searchQuery.trim().length > 0

  function handleClearFilters() {
    setActionFilter('all')
    setSearchQuery('')
    setPage(1)
  }

  function handleExport() {
    exportAuditLogsCsv(filteredLogs)
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
            Audit logs
          </Typography>
          <Typography variant="bodyMd" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign-in activity and security events for your account.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<MaterialSymbol name="refresh" />}
            onClick={() => void loadLogs()}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<MaterialSymbol name="download" />}
            onClick={handleExport}
            disabled={loading || filteredLogs.length === 0}
          >
            Export logs
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AuditLogsFilters
          actionFilter={actionFilter}
          onActionFilterChange={setActionFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          resultCount={filteredLogs.length}
          totalCount={logs.length}
          onClear={handleClearFilters}
        />

        {loading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : logs.length === 0 ? (
          <AuditLogsEmptyState filtered={false} />
        ) : filteredLogs.length === 0 ? (
          <AuditLogsEmptyState filtered={hasFilters} />
        ) : (
          <>
            <AuditLogsTable
              entries={pagedLogs}
              totalCount={filteredLogs.length}
              page={page}
              onPageChange={setPage}
            />
            <AuditLogsStatCards entries={filteredLogs} />
          </>
        )}
      </Box>
    </Box>
  )
}
