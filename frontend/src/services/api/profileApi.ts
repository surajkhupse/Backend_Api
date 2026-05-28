import api from './client'

type ApiEnvelope<T> = {
  statusCode?: number
  message?: string
} & T

export type ProfileTheme = 'light' | 'dark'

export type ProfileRecord = {
  _id: string
  name: string
  email: string
  role: string
  jobTitle?: string
  bio?: string
  avatar?: string
  theme?: ProfileTheme
  publicProfile?: boolean
  usageData?: boolean
}

export type UpdateProfileBody = {
  name?: string
  jobTitle?: string
  bio?: string
  avatar?: string
  theme?: ProfileTheme
  publicProfile?: boolean
  usageData?: boolean
}

export async function getMyProfileApi(): Promise<ProfileRecord> {
  const { data } = await api.get<ApiEnvelope<{ user: ProfileRecord }>>('/api/users/me')
  if (!data.user) throw new Error('Invalid profile response')
  return data.user
}

export async function updateMyProfileApi(body: UpdateProfileBody): Promise<ProfileRecord> {
  const { data } = await api.put<ApiEnvelope<{ user: ProfileRecord }>>('/api/users/me', body)
  if (!data.user) throw new Error('Invalid profile response')
  return data.user
}
