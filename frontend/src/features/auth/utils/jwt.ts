export type UserRole = 'superadmin' | 'tenant_admin' | 'member' | 'viewer'

export type AccessTokenPayload = {
  id?: string
  role?: UserRole
  tenantId?: string | null
  exp?: number
}

export function decodeAccessTokenPayload(accessToken: string | null | undefined): AccessTokenPayload | null {
  if (!accessToken) return null
  try {
    const parts = accessToken.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='))
    return JSON.parse(json) as AccessTokenPayload
  } catch {
    return null
  }
}

export function getRoleFromAccessToken(accessToken: string | null | undefined): UserRole | null {
  return decodeAccessTokenPayload(accessToken)?.role ?? null
}

export function isSuperadminRole(role: UserRole | null | undefined): boolean {
  return role === 'superadmin'
}

/** Read role from access token; returns null if token missing or role claim absent. */
export function syncRoleFromAccessToken(accessToken: string | null | undefined): UserRole | null {
  return getRoleFromAccessToken(accessToken)
}
