import { isAxiosError } from 'axios'

export function extractApiError(err: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(err)) {
    const msg = err.response?.data?.message
    if (typeof msg === 'string') return msg
    if (err.response?.status === 403) return 'You do not have permission for this action.'
    if (err.code === 'ERR_NETWORK') return 'Cannot reach the API.'
  }
  if (err instanceof Error) return err.message
  return fallback
}
