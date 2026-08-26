const PAGE_SIZE = 10

export function getAuditLogPageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE))
}

export function paginateAuditLogs<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE
  return items.slice(start, start + PAGE_SIZE)
}

export { PAGE_SIZE as AUDIT_LOG_PAGE_SIZE }
