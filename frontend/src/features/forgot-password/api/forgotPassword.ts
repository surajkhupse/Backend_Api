import { isAxiosError } from 'axios'

type ApiErrorBody = { message?: string }

export async function forgotPasswordRequest(email: string): Promise<string> {
  const { default: api } = await import('../../../services/api/client')
  const { data } = await api.post<{ message?: string }>('/api/auth/forgot-password', {
    email: email.trim().toLowerCase(),
  })
  return data?.message ?? "If an account exists for that email, we've sent reset instructions."
}

export function getForgotPasswordErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const d = error.response?.data as ApiErrorBody | undefined
    if (d && typeof d.message === 'string') return d.message
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the API. Check the server and VITE_API_URL.'
    }
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
