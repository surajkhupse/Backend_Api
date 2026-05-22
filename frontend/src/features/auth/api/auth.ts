import { isAxiosError, type AxiosError } from 'axios'
import { getAccounts } from '../../../api/generated/accounts/accounts'
import type {
  AccountLockedResponse,
  AuthTokensResponse,
  Error,
  LoginInput,
  RegisterInput,
  RegisterUserResponse,
} from '../../../api/generated/models'

const accountsApi = getAccounts()

export type LoginRequest = LoginInput
/** Narrowed after successful sign-in (required token fields). */
export type LoginSuccessBody = AuthTokensResponse & {
  accessToken: string
  refreshToken: string
  token: string
  expiresIn: number
}
export type RegisterRequest = RegisterInput
export type RegisterSuccessBody = RegisterUserResponse
export type AccountLockedBody = AccountLockedResponse & {
  lockUntil: string
  message: string
}
export type ApiErrorBody = Error

export async function loginRequest(body: LoginRequest): Promise<LoginSuccessBody> {
  const data = await accountsApi.authUserSignIn({
    ...body,
    email: body.email.trim().toLowerCase(),
    password: body.password.trim(),
  })
  if (!data.accessToken || !data.refreshToken) {
    throw new Error('Sign-in succeeded but tokens were missing from the server response')
  }
  return {
    ...data,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    token: data.token ?? data.accessToken,
    expiresIn: data.expiresIn ?? 0,
  }
}

export async function registerRequest(body: RegisterRequest): Promise<RegisterSuccessBody> {
  return accountsApi.register(body)
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await accountsApi.logoutSession({ refreshToken })
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
