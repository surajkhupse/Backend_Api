import type { AuditActionFilter, AuditLogEntry } from '../types'
import { formatAuditTimestamp, presentAuditLogEntry } from './auditLogPresentation'

export function filterAuditLogs(
  logs: AuditLogEntry[],
  actionFilter: AuditActionFilter,
  searchQuery: string,
): AuditLogEntry[] {
  let result = logs

  if (actionFilter !== 'all') {
    result = result.filter((e) => e.action === actionFilter)
  }

  const q = searchQuery.trim().toLowerCase()
  if (!q) return result

  return result.filter((entry) => {
    const row = presentAuditLogEntry(entry)
    const haystack = [
      entry.action,
      row.label,
      row.target,
      entry.ipAddress,
      entry.userAgent ?? '',
      formatAuditTimestamp(entry.createdAt),
      JSON.stringify(entry.metadata ?? {}),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}
