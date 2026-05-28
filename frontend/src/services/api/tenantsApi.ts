import api from './client'
import { normalizeTenant, normalizeTenantsList } from './tenantNormalize'

export type TenantStatus = 'active' | 'inactive' | 'suspended'
export type TenantImpersonationTokens = {
  accessToken: string
  refreshToken: string
  token: string
  expiresIn: number
}

export type TenantRecord = {
  _id: string
  name: string
  slug: string
  domain?: string
  status: TenantStatus
  owner: string
  settings?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/** Body for POST /api/tenants */
export type CreateTenantBody = {
  /** Required — display name; slug is generated on the server */
  name: string
  /** Optional — custom domain */
  domain?: string
  /** Optional — defaults to active */
  status?: TenantStatus
  /** Required when superadmin creates — tenant owner email */
  ownerEmail?: string
  /** Required with ownerEmail when creating tenant owner account */
  password?: string
  /** Required with ownerEmail when creating tenant owner account */
  confirmPassword?: string
  /** Alternative to ownerEmail */
  ownerId?: string
}

type ApiEnvelope<T> = {
  statusCode?: number
  message?: string
} & T

export async function createTenantApi(body: CreateTenantBody): Promise<TenantRecord> {
  const { data } = await api.post<ApiEnvelope<{ tenant: unknown }>>('/api/tenants', body)
  const tenant = data.tenant
  if (!tenant || typeof tenant !== 'object') {
    throw new Error('Invalid create tenant response')
  }
  const normalized = normalizeTenant(tenant as Record<string, unknown>)
  if (!normalized) throw new Error('Invalid tenant data in response')
  return normalized
}

export async function listTenantsApi(): Promise<TenantRecord[]> {
  const { data } = await api.get<ApiEnvelope<{ tenants: unknown }>>('/api/tenants')
  return normalizeTenantsList(data)
}

export async function changeTenantStatusApi(
  id: string,
  status: TenantStatus,
): Promise<TenantRecord> {
  const { data } = await api.put<ApiEnvelope<{ tenant: unknown }>>(
    `/api/tenants/${id}/status`,
    { status },
  )
  const normalized = normalizeTenant((data.tenant ?? {}) as Record<string, unknown>)
  if (!normalized) throw new Error('Invalid tenant data in response')
  return normalized
}

export async function deleteTenantApi(id: string): Promise<void> {
  await api.delete(`/api/tenants/${id}`)
}

export async function impersonateTenantApi(id: string): Promise<TenantImpersonationTokens> {
  const { data } = await api.post<ApiEnvelope<TenantImpersonationTokens>>(`/api/tenants/${id}/impersonate`)
  if (!data.accessToken || !data.refreshToken) {
    throw new Error('Invalid impersonation response')
  }
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    token: data.token ?? data.accessToken,
    expiresIn: typeof data.expiresIn === 'number' ? data.expiresIn : 0,
  }
}
