export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGIN_LOCKED'
  | 'LOGIN_SSO_SUCCESS'

export interface AuditLogEntry {
  id: string
  action: AuditAction
  ipAddress: string
  userAgent?: string
  metadata?: Record<string, unknown>
  createdAt?: string
}

export interface AuditLogsResponse {
  statusCode?: number
  message?: string
  logs?: AuditLogEntry[]
}

export type AuditActionFilter = 'all' | AuditAction
