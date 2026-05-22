import type { AuditLogEntry } from '../types'

export type AuditStatusTone = 'success' | 'warning' | 'info'

export interface AuditRowPresentation {
  label: string
  icon: string
  target: string
  statusLabel: string
  statusTone: AuditStatusTone
}

function metadataReason(entry: AuditLogEntry): string | undefined {
  const reason = entry.metadata?.reason
  return typeof reason === 'string' ? reason : undefined
}

export function formatAuditTimestamp(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function presentAuditLogEntry(entry: AuditLogEntry): AuditRowPresentation {
  const reason = metadataReason(entry)

  switch (entry.action) {
    case 'LOGIN_SUCCESS':
      return {
        label: 'Successful sign-in',
        icon: 'login',
        target: 'Password authentication',
        statusLabel: 'Success',
        statusTone: 'success',
      }
    case 'LOGIN_SSO_SUCCESS':
      return {
        label: 'Google sign-in',
        icon: 'account_circle',
        target: 'Google SSO',
        statusLabel: 'Success',
        statusTone: 'success',
      }
    case 'LOGIN_LOCKED':
      return {
        label: 'Account locked',
        icon: 'lock',
        target:
          typeof entry.metadata?.lockUntil === 'string'
            ? `Locked until ${new Date(entry.metadata.lockUntil).toLocaleString()}`
            : 'Too many failed attempts',
        statusLabel: 'Warning',
        statusTone: 'warning',
      }
    case 'LOGIN_FAILURE':
      if (reason === 'unknown_user') {
        return {
          label: 'Failed sign-in',
          icon: 'person_off',
          target: 'Unknown email',
          statusLabel: 'Warning',
          statusTone: 'warning',
        }
      }
      if (reason === 'google_only') {
        return {
          label: 'Failed sign-in',
          icon: 'no_accounts',
          target: 'Google-only account',
          statusLabel: 'Info',
          statusTone: 'info',
        }
      }
      if (reason === 'bad_password') {
        return {
          label: 'Failed sign-in',
          icon: 'key_off',
          target: 'Invalid password',
          statusLabel: entry.metadata?.accountLocked ? 'Warning' : 'Warning',
          statusTone: 'warning',
        }
      }
      return {
        label: 'Failed sign-in',
        icon: 'login',
        target: 'Sign-in portal',
        statusLabel: 'Warning',
        statusTone: 'warning',
      }
    default:
      return {
        label: entry.action,
        icon: 'receipt_long',
        target: '—',
        statusLabel: 'Info',
        statusTone: 'info',
      }
  }
}

export function exportAuditLogsCsv(entries: AuditLogEntry[]): void {
  const header = ['timestamp', 'action', 'ip', 'user_agent', 'metadata']
  const rows = entries.map((e) => [
    e.createdAt ?? '',
    e.action,
    e.ipAddress,
    (e.userAgent ?? '').replace(/"/g, '""'),
    JSON.stringify(e.metadata ?? {}),
  ])
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
