import api from './client'
import { normalizeUsersList, type UserRecord } from './userNormalize'

type ApiEnvelope<T> = {
  statusCode?: number
  message?: string
} & T

export type { UserRecord }

export async function listUsersApi(): Promise<UserRecord[]> {
  const { data } = await api.get<ApiEnvelope<{ users: unknown }>>('/api/users')
  return normalizeUsersList(data)
}
