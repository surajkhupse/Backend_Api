import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { getAccounts } from '../../api/generated/accounts/accounts'
import type { ListMyAuditLogsParams } from '../../api/generated/models'
import type { AuditActionFilter, AuditLogEntry } from '../../features/audit/types'

const accountsApi = getAccounts()

export interface AuditState {
  logs: AuditLogEntry[]
  loading: boolean
  error: string | null
  actionFilter: AuditActionFilter
  searchQuery: string
}

const initialState: AuditState = {
  logs: [],
  loading: false,
  error: null,
  actionFilter: 'all',
  searchQuery: '',
}

export const fetchAuditLogs = createAsyncThunk<
  AuditLogEntry[],
  { limit?: number; action?: ListMyAuditLogsParams['action']; q?: string } | void,
  { rejectValue: string }
>('audit/fetchLogs', async (params, { rejectWithValue }) => {
  try {
    const { limit = 100, action, q } = params ?? {}
    const data = await accountsApi.listMyAuditLogs({
      limit,
      ...(action ? { action } : {}),
      ...(q?.trim() ? { q: q.trim() } : {}),
    })
    return (data.logs ?? []) as AuditLogEntry[]
  } catch (err) {
    if (isAxiosError(err)) {
      const msg = (err.response?.data as { message?: string } | undefined)?.message
      if (typeof msg === 'string') return rejectWithValue(msg)
      if (err.response?.status === 401) return rejectWithValue('Sign in again to view audit logs.')
      if (err.code === 'ERR_NETWORK') {
        return rejectWithValue('Cannot reach the API. Start the backend and check VITE_API_URL.')
      }
    }
    if (err instanceof Error) return rejectWithValue(err.message)
    return rejectWithValue('Failed to load audit logs')
  }
})

export const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setAuditActionFilter(state, action: PayloadAction<AuditActionFilter>) {
      state.actionFilter = action.payload
    },
    setAuditSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    clearAuditFilters(state) {
      state.actionFilter = 'all'
      state.searchQuery = ''
    },
    clearAuditError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        state.logs = action.payload
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load audit logs'
        state.logs = []
      })
  },
})

export const { setAuditActionFilter, setAuditSearchQuery, clearAuditFilters, clearAuditError } =
  auditSlice.actions

export default auditSlice.reducer
