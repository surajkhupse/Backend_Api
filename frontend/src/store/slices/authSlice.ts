import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isAxiosError, type AxiosError } from 'axios'
import { getAccounts } from '../../api/generated/accounts/accounts'
import type {
  AccountLockedResponse,
  AuthTokensResponse,
  Error as ApiError,
  LoginInput,
  RegisterInput,
} from '../../api/generated/models'
import {
  clearStoredTokens,
  persistTokens,
  readPersistedAuth,
  setRememberMe,
} from '../../features/auth/utils/authStorage'
import { syncRoleFromAccessToken, type UserRole } from '../../features/auth/utils/jwt'

const accountsApi = getAccounts()

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface SetTokensPayload extends AuthTokens {
  rememberMe?: boolean
}

export type AccountLockedBody = AccountLockedResponse & {
  lockUntil: string
  message: string
}

export interface AuthState {
  tokens: AuthTokens | null
  /** From JWT at login / app load — drives sidebar and redirects */
  role: UserRole | null
  loading: boolean
  error: string | null
  accountLocked: AccountLockedBody | null
}

function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const d = error.response?.data as ApiError | AccountLockedBody | undefined
    if (d && typeof d.message === 'string') {
      if (d.message === 'This account uses Google sign-in') {
        return 'This email is linked to Google. Use "Sign in with Google" or reset your password.'
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

function getRegisterErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const d = error.response?.data as ApiError | undefined
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

export function isAccountLockedError(
  error: unknown,
): error is AxiosError<AccountLockedBody> {
  return (
    isAxiosError<AccountLockedBody>(error) &&
    error.response?.status === 423 &&
    typeof error.response.data?.lockUntil === 'string'
  )
}

export const login = createAsyncThunk<
  AuthTokensResponse & { accessToken: string; refreshToken: string },
  LoginInput & { rememberMe?: boolean },
  { rejectValue: string }
>('auth/login', async ({ rememberMe, ...body }, { rejectWithValue }) => {
  try {
    const data = await accountsApi.authUserSignIn({
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
    })
    if (!data.accessToken || !data.refreshToken) {
      return rejectWithValue('Sign-in succeeded but tokens were missing from the server response')
    }
    persistTokens(data.accessToken, data.refreshToken, rememberMe ?? false)
    return { ...data, accessToken: data.accessToken, refreshToken: data.refreshToken }
  } catch (err) {
    if (isAccountLockedError(err)) {
      return rejectWithValue(JSON.stringify({
        locked: true,
        message: err.response?.data?.message ?? 'Account temporarily locked.',
        lockUntil: err.response?.data?.lockUntil,
      }))
    }
    return rejectWithValue(getLoginErrorMessage(err))
  }
})

export const registerUser = createAsyncThunk<
  AuthTokensResponse & { accessToken: string; refreshToken: string },
  RegisterInput & { rememberMe?: boolean },
  { rejectValue: string }
>('auth/register', async ({ rememberMe, ...body }, { rejectWithValue }) => {
  try {
    await accountsApi.register(body)
    const data = await accountsApi.authUserSignIn({
      email: body.email.trim().toLowerCase(),
      password: body.password.trim(),
    })
    if (!data.accessToken || !data.refreshToken) {
      return rejectWithValue('Registration succeeded but auto-login failed')
    }
    persistTokens(data.accessToken, data.refreshToken, rememberMe ?? false)
    return { ...data, accessToken: data.accessToken, refreshToken: data.refreshToken }
  } catch (err) {
    return rejectWithValue(getRegisterErrorMessage(err))
  }
})

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const refreshToken = state.auth.tokens?.refreshToken
      if (refreshToken) {
        await accountsApi.logoutSession({ refreshToken })
      }
      clearStoredTokens()
    } catch (err) {
      clearStoredTokens()
      return rejectWithValue(err instanceof Error ? err.message : 'Logout failed')
    }
  },
)

const persisted = readPersistedAuth()
if (persisted) {
  setRememberMe(persisted.rememberMe)
}
const persistedTokens: AuthTokens | null = persisted
  ? { accessToken: persisted.accessToken, refreshToken: persisted.refreshToken }
  : null

const initialState: AuthState = {
  tokens: persistedTokens,
  role: syncRoleFromAccessToken(persistedTokens?.accessToken ?? null),
  loading: false,
  error: null,
  accountLocked: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<SetTokensPayload>) => {
      const { accessToken, refreshToken, rememberMe = false } = action.payload
      persistTokens(accessToken, refreshToken, rememberMe)
      state.tokens = { accessToken, refreshToken }
      state.role = syncRoleFromAccessToken(accessToken)
    },
    clearTokens: (state) => {
      clearStoredTokens()
      state.tokens = null
      state.role = null
    },
    clearAuthError: (state) => {
      state.error = null
      state.accountLocked = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
        state.accountLocked = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.tokens = {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        }
        state.role = syncRoleFromAccessToken(action.payload.accessToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        const msg = action.payload ?? 'Sign-in failed'
        try {
          const parsed = JSON.parse(msg)
          if (parsed.locked) {
            state.accountLocked = parsed as AccountLockedBody
            state.error = parsed.message
            return
          }
        } catch { /* not JSON, plain error message */ }
        state.error = msg
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.tokens = {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        }
        state.role = syncRoleFromAccessToken(action.payload.accessToken)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Registration failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.tokens = null
        state.role = null
        state.loading = false
      })
      .addCase(logout.rejected, (state) => {
        state.tokens = null
        state.role = null
        state.loading = false
      })
  },
})

export const { setTokens, clearTokens, clearAuthError } = authSlice.actions
export default authSlice.reducer
