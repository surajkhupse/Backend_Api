import { isAxiosError } from 'axios'
import { api } from '../../../services/api/client'
import type { AuditLogEntry, AuditLogsResponse } from '../types'

export async function fetchMyAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  const { data } = await api.get<AuditLogsResponse>('/api/auth/audit-logs', {
    params: { limit },
  })
  return data.logs ?? []
}

export function getAuditLogsErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)?.message
    if (typeof msg === 'string') return msg
    if (error.response?.status === 401) return 'Sign in again to view audit logs.'
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the API. Start the backend and check VITE_API_URL.'
    }
  }
  if (error instanceof Error) return error.message
  return 'Failed to load audit logs'
}
