import { useCallback, useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearAuditFilters } from '../../store/slices/auditFilterSlice'
import { MaterialSymbol } from '../../theme'
import { layout } from '../../theme/tokens/spacing'
import { fetchMyAuditLogs, getAuditLogsErrorMessage } from './api/auditLogs'
import { AuditLogsEmptyState } from './components/AuditLogsEmptyState'
import { AuditLogsFilters } from './components/AuditLogsFilters'
import { getAuditLogPageCount, paginateAuditLogs } from './components/AuditLogsPagination'
import { AuditLogsStatCards } from './components/AuditLogsStatCards'
import { AuditLogsTable } from './components/AuditLogsTable'
import type { AuditLogEntry } from './types'
import { exportAuditLogsCsv } from './utils/auditLogPresentation'

export function AuditLogsPage() {
  const dispatch = useAppDispatch()
  const actionFilter = useAppSelector((state) => state.auditFilter.actionFilter)
  const searchQuery = useAppSelector((state) => state.auditFilter.searchQuery)
  const debouncedSearch = useDebouncedValue(searchQuery, 300)

  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const loadLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMyAuditLogs({
        limit: 100,
        action: actionFilter === 'all' ? undefined : actionFilter,
        q: debouncedSearch,
      })
      setLogs(data)
      setPage(1)
    } catch (err) {
      setError(getAuditLogsErrorMessage(err))
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [actionFilter, debouncedSearch])

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  useEffect(() => {
    setPage(1)
  }, [actionFilter, debouncedSearch])

  useEffect(() => {
    const maxPage = getAuditLogPageCount(logs.length)
    if (page > maxPage) setPage(maxPage)
  }, [logs.length, page])

  const pagedLogs = useMemo(() => paginateAuditLogs(logs, page), [logs, page])

  const hasFilters = actionFilter !== 'all' || searchQuery.trim().length > 0

  function handleClearFilters() {
    dispatch(clearAuditFilters())
    setPage(1)
  }

  function handleExport() {
    exportAuditLogsCsv(logs)
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
            disabled={loading || logs.length === 0}
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
        <AuditLogsFilters resultCount={logs.length} onClear={handleClearFilters} />

        {loading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : logs.length === 0 ? (
          <AuditLogsEmptyState filtered={hasFilters} />
        ) : (
          <>
            <AuditLogsTable
              entries={pagedLogs}
              totalCount={logs.length}
              page={page}
              onPageChange={setPage}
            />
            <AuditLogsStatCards entries={logs} />
          </>
        )}
      </Box>
    </Box>
  )
}
