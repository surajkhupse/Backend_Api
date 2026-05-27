export type UserRole = 'superadmin' | 'tenant_admin' | 'member' | 'viewer'

export type UserRecord = {
  _id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  tenantId: string | null
  tenantName: string | null
  createdAt: string
  updatedAt: string
}

const ROLES: UserRole[] = ['superadmin', 'tenant_admin', 'member', 'viewer']

export function normalizeUser(raw: Record<string, unknown>): UserRecord | null {
  const id = raw._id ?? raw.id
  const name = raw.name
  const email = raw.email
  if (id == null || typeof name !== 'string' || typeof email !== 'string') return null

  const role = raw.role
  const normalizedRole: UserRole =
    typeof role === 'string' && ROLES.includes(role as UserRole) ? (role as UserRole) : 'member'

  const tenant = raw.tenant
  let tenantId: string | null = null
  let tenantName: string | null = null
  if (typeof tenant === 'string') {
    tenantId = tenant
  } else if (tenant && typeof tenant === 'object') {
    const t = tenant as Record<string, unknown>
    if (t._id != null) tenantId = String(t._id)
    if (typeof t.name === 'string') tenantName = t.name
  }

  return {
    _id: String(id),
    name,
    email,
    role: normalizedRole,
    isActive: raw.isActive !== false,
    tenantId,
    tenantName,
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

export function normalizeUsersList(payload: unknown): UserRecord[] {
  if (!payload || typeof payload !== 'object') return []
  const data = payload as Record<string, unknown>
  const list = Array.isArray(data.users) ? data.users : Array.isArray(payload) ? payload : []
  return list
    .map((item) =>
      item && typeof item === 'object' ? normalizeUser(item as Record<string, unknown>) : null,
    )
    .filter((u): u is UserRecord => u !== null)
}
