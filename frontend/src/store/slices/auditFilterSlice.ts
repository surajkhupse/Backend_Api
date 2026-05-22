import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuditActionFilter } from '../../features/audit/types'

export type AuditFilterState = {
  actionFilter: AuditActionFilter
  searchQuery: string
}

const initialState: AuditFilterState = {
  actionFilter: 'all',
  searchQuery: '',
}

export const auditFilterSlice = createSlice({
  name: 'auditFilter',
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
  },
})

export const { setAuditActionFilter, setAuditSearchQuery, clearAuditFilters } =
  auditFilterSlice.actions

export type { AuditActionFilter }

export default auditFilterSlice.reducer
