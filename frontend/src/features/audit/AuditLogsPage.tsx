import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearAuditError,
  clearAuditFilters,
  fetchAuditLogs,
} from "../../store/slices/auditSlice";

import { MaterialSymbol } from "../../theme";
import { layout } from "../../theme/tokens/spacing";

import { AuditLogsEmptyState } from "./components/AuditLogsEmptyState";
import { AuditLogsFilters } from "./components/AuditLogsFilters";
import {
  getAuditLogPageCount,
  paginateAuditLogs,
} from "./utils/auditLogsPagination";
import { AuditLogsStatCards } from "./components/AuditLogsStatCards";
import { AuditLogsTable } from "./components/AuditLogsTable";
import { exportAuditLogsCsv } from "./utils/auditLogPresentation";

export function AuditLogsPage() {
  const dispatch = useAppDispatch();

  const { logs, loading, error, actionFilter, searchQuery } = useAppSelector(
    (state) => state.audit,
  );

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const queryParams = useMemo(
    () => ({
      limit: 100,
      action: actionFilter === "all" ? undefined : actionFilter,
      q: debouncedSearch,
    }),
    [actionFilter, debouncedSearch],
  );
  const filterKey = `${actionFilter}:${debouncedSearch}`;
  const [pageState, setPageState] = useState({ filterKey, page: 1 });

  // Fetch logs when filters change
  useEffect(() => {
    dispatch(fetchAuditLogs(queryParams));
  }, [dispatch, queryParams]);

  const maxPage = useMemo(
    () => getAuditLogPageCount(logs.length),
    [logs.length],
  );

  const page = pageState.filterKey === filterKey ? pageState.page : 1;
  const currentPage = Math.min(page, Math.max(maxPage, 1));

  const pagedLogs = useMemo(
    () => paginateAuditLogs(logs, currentPage),
    [logs, currentPage],
  );

  const hasFilters = useMemo(
    () => actionFilter !== "all" || searchQuery.trim().length > 0,
    [actionFilter, searchQuery],
  );

  const handleRefresh = useCallback(() => {
    dispatch(fetchAuditLogs(queryParams));
  }, [dispatch, queryParams]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearAuditFilters());
  }, [dispatch]);

  const handleExport = useCallback(() => {
    exportAuditLogsCsv(logs);
  }, [logs]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPageState({ filterKey, page: nextPage });
    },
    [filterKey],
  );

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 2, md: 4 },
        maxWidth: layout.maxContainerWidth,
        width: 1,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          justifyContent: "space-between",
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

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<MaterialSymbol name="refresh" />}
            onClick={handleRefresh}
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
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearAuditError())}
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <AuditLogsStatCards entries={logs} />

        <AuditLogsFilters
          resultCount={logs.length}
          onClear={handleClearFilters}
        />

        {loading ? (
          <Box
            sx={{
              py: 8,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : logs.length === 0 ? (
          <AuditLogsEmptyState filtered={hasFilters} />
        ) : (
          <AuditLogsTable
            entries={pagedLogs}
            totalCount={logs.length}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </Box>
    </Box>
  );
}
