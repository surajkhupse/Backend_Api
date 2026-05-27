import type { TenantRecord, TenantStatus } from './tenantsApi'

const STATUSES: TenantStatus[] = ['active', 'inactive', 'suspended']

export function normalizeTenant(raw: Record<string, unknown>): TenantRecord | null {
  const id = raw._id ?? raw.id
  const name = raw.name
  const slug = raw.slug
  if (id == null || typeof name !== 'string' || typeof slug !== 'string') return null

  const status = raw.status
  const normalizedStatus: TenantStatus =
    typeof status === 'string' && STATUSES.includes(status as TenantStatus)
      ? (status as TenantStatus)
      : 'active'

  const owner = raw.owner
  let ownerId = ''
  if (typeof owner === 'string') ownerId = owner
  else if (owner && typeof owner === 'object' && '_id' in owner) {
    ownerId = String((owner as { _id: unknown })._id)
  }

  return {
    _id: String(id),
    name,
    slug,
    domain: typeof raw.domain === 'string' ? raw.domain : undefined,
    status: normalizedStatus,
    owner: ownerId,
    settings:
      raw.settings && typeof raw.settings === 'object' && !Array.isArray(raw.settings)
        ? (raw.settings as Record<string, unknown>)
        : undefined,
    createdAt:
      typeof raw.createdAt === 'string'
        ? raw.createdAt
        : raw.createdAt instanceof Date
          ? raw.createdAt.toISOString()
          : new Date().toISOString(),
    updatedAt:
      typeof raw.updatedAt === 'string'
        ? raw.updatedAt
        : raw.updatedAt instanceof Date
          ? raw.updatedAt.toISOString()
          : new Date().toISOString(),
  }
}

export function normalizeTenantsList(payload: unknown): TenantRecord[] {
  if (!payload || typeof payload !== 'object') return []

  const data = payload as Record<string, unknown>
  let list: unknown[] = []

  if (Array.isArray(data.tenants)) {
    list = data.tenants
  } else if (Array.isArray(data.data)) {
    list = data.data
  } else if (Array.isArray(payload)) {
    list = payload
  }

  return list
    .map((item) =>
      item && typeof item === 'object' ? normalizeTenant(item as Record<string, unknown>) : null,
    )
    .filter((t): t is TenantRecord => t !== null)
}
