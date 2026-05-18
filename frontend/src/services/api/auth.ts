import { isAxiosError, type AxiosError } from 'axios'
import { api } from './client'

export interface LoginRequest {
  email: string
  password: string
  deviceName?: string
}

export interface LoginSuccessBody {
  statusCode: number
  message: string
  accessToken: string
  refreshToken: string
  token: string
  expiresIn: number
}

export interface AccountLockedBody {
  statusCode: number
  message: string
  lockUntil: string
}

export interface ApiErrorBody {
  statusCode: number
  message: string
}

export async function loginRequest(body: LoginRequest): Promise<LoginSuccessBody> {
  const { data } = await api.post<LoginSuccessBody>('/api/auth/login', body)
  return data
}

export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const d = error.response?.data as ApiErrorBody | AccountLockedBody | undefined
    if (d && typeof d.message === 'string') return d.message
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the API. Check the server and VITE_API_URL.'
    }
  }
  if (error instanceof Error) return error.message
  return 'Sign-in failed'
}

export function isAccountLockedError(
  error: unknown
): error is AxiosError<AccountLockedBody> {
  return (
    isAxiosError<AccountLockedBody>(error) &&
    error.response?.status === 423 &&
    typeof error.response.data?.lockUntil === 'string'
  )
}
