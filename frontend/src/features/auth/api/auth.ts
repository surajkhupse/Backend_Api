import { isAxiosError, type AxiosError } from 'axios'
import { api } from '../../../services/api/client'

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
  const { data } = await api.post<LoginSuccessBody>('/api/auth/login', {
    ...body,
    email: body.email.trim().toLowerCase(),
    password: body.password.trim(),
  })
  if (!data.accessToken || !data.refreshToken) {
    throw new Error('Sign-in succeeded but tokens were missing from the server response')
  }
  return data
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterSuccessBody {
  statusCode: number
  message: string
  user: {
    name: string
    email: string
  }
}

export async function registerRequest(body: RegisterRequest): Promise<RegisterSuccessBody> {
  const { data } = await api.post<RegisterSuccessBody>('/api/auth/register', body)
  return data
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await api.post('/api/auth/logout', { refreshToken })
}

export function getRegisterErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const d = error.response?.data as ApiErrorBody | undefined
    if (d && typeof d.message === 'string') return d.message
    if (error.response?.status === 409) {
      return 'An account with this email already exists. Try signing in.'
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the API. Check the server and VITE_API_URL.'
    }
  }
  if (error instanceof Error) return error.message
  return 'Registration failed'
}

export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const d = error.response?.data as ApiErrorBody | AccountLockedBody | undefined
    if (d && typeof d.message === 'string') {
      if (d.message === 'This account uses Google sign-in') {
        return 'This email is linked to Google. Use “Sign in with Google” or reset your password.'
      }
      if (d.message === 'Invalid credentials') {
        return 'Email or password is incorrect. If you registered before password login was added, sign up again or use forgot password.'
      }
      return d.message
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the API. Start the backend (port 5000) and check VITE_API_URL in frontend/.env.'
    }
  }
  if (error instanceof Error) return error.message
  return 'Sign-in failed'
}

export function isAccountLockedError(
  error: unknown,
): error is AxiosError<AccountLockedBody> {
  return (
    isAxiosError<AccountLockedBody>(error) &&
    error.response?.status === 423 &&
    typeof error.response.data?.lockUntil === 'string'
  )
}
