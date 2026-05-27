// @generated-from-service 4beb610b04693600
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { getAccounts } from '../../api/generated/accounts/accounts'
import type {
  GoogleSsoCallbackParams,
  RegisterInput,
  LoginInput,
  ListMyAuditLogsParams,
  RefreshTokenInput,
  LogoutInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../../api/generated/models'

const accountsApi = getAccounts()

// TODO: define the shape of your entity
export interface Account {
  _id: string
  createdAt: string
  updatedAt: string
}

export interface AccountState {
  items: Account[]
  currentItem: Account | null
  loading: boolean
  error: string | null
}

const initialState: AccountState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
}

function extractError(err: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(err)) {
    const msg = err.response?.data?.message
    if (typeof msg === 'string') return msg
    if (err.response?.status === 403) return 'You do not have permission for this action.'
    if (err.code === 'ERR_NETWORK') return 'Cannot reach the API.'
  }
  if (err instanceof Error) return err.message
  return fallback
}

/** Start Google SSO (browser redirect) */
export const googleSsoStart = createAsyncThunk<unknown, void, { rejectValue: string }>(
  'account/googleSsoStart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await accountsApi.googleSsoStart()
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: googleSsoStart'))
    }
  },
)

/** Google OAuth callback (redirect_uri) */
export const googleSsoCallback = createAsyncThunk<unknown, GoogleSsoCallbackParams, { rejectValue: string }>(
  'account/googleSsoCallback',
  async (params, { rejectWithValue }) => {
    try {
      const data = await accountsApi.googleSsoCallback(params)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: googleSsoCallback'))
    }
  },
)

/** Register a new user */
export const register = createAsyncThunk<unknown, RegisterInput, { rejectValue: string }>(
  'account/register',
  async (registerInput, { rejectWithValue }) => {
    try {
      const data = await accountsApi.register(registerInput)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: register'))
    }
  },
)

/** User sign-in (returns access + refresh tokens) */
export const authUserSignIn = createAsyncThunk<unknown, LoginInput, { rejectValue: string }>(
  'account/authUserSignIn',
  async (loginInput, { rejectWithValue }) => {
    try {
      const data = await accountsApi.authUserSignIn(loginInput)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: authUserSignIn'))
    }
  },
)

/** List active refresh-token sessions (devices) */
export const listAuthSessions = createAsyncThunk<unknown, void, { rejectValue: string }>(
  'account/listAuthSessions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await accountsApi.listAuthSessions()
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: listAuthSessions'))
    }
  },
)

/** Account audit trail (login-related events) */
export const listMyAuditLogs = createAsyncThunk<unknown, ListMyAuditLogsParams, { rejectValue: string }>(
  'account/listMyAuditLogs',
  async (params, { rejectWithValue }) => {
    try {
      const data = await accountsApi.listMyAuditLogs(params)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: listMyAuditLogs'))
    }
  },
)

/** Log out from all devices */
export const logoutAllDevices = createAsyncThunk<unknown, void, { rejectValue: string }>(
  'account/logoutAllDevices',
  async (_, { rejectWithValue }) => {
    try {
      const data = await accountsApi.logoutAllDevices()
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: logoutAllDevices'))
    }
  },
)

/** Exchange refresh token for a new access + refresh pair */
export const refreshAccessToken = createAsyncThunk<unknown, RefreshTokenInput, { rejectValue: string }>(
  'account/refreshAccessToken',
  async (refreshTokenInput, { rejectWithValue }) => {
    try {
      const data = await accountsApi.refreshAccessToken(refreshTokenInput)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: refreshAccessToken'))
    }
  },
)

/** Revoke a refresh token (sign out this session) */
export const logoutSession = createAsyncThunk<unknown, LogoutInput, { rejectValue: string }>(
  'account/logoutSession',
  async (logoutInput, { rejectWithValue }) => {
    try {
      const data = await accountsApi.logoutSession(logoutInput)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: logoutSession'))
    }
  },
)

/** Request password reset email (same response whether email exists) */
export const forgotPassword = createAsyncThunk<unknown, ForgotPasswordInput, { rejectValue: string }>(
  'account/forgotPassword',
  async (forgotPasswordInput, { rejectWithValue }) => {
    try {
      const data = await accountsApi.forgotPassword(forgotPasswordInput)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: forgotPassword'))
    }
  },
)

/** Set a new password using the token from the reset link */
export const resetPassword = createAsyncThunk<unknown, ResetPasswordInput, { rejectValue: string }>(
  'account/resetPassword',
  async (resetPasswordInput, { rejectWithValue }) => {
    try {
      const data = await accountsApi.resetPassword(resetPasswordInput)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: resetPassword'))
    }
  },
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearAccountError(state) {
      state.error = null
    },
    setCurrentAccount(state, action) {
      state.currentItem = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(googleSsoStart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(googleSsoStart.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(googleSsoStart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: googleSsoStart'
      })
      .addCase(googleSsoCallback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(googleSsoCallback.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(googleSsoCallback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: googleSsoCallback'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: register'
      })
      .addCase(authUserSignIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(authUserSignIn.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(authUserSignIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: authUserSignIn'
      })
      .addCase(listAuthSessions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listAuthSessions.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload as Account[]
      })
      .addCase(listAuthSessions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: listAuthSessions'
      })
      .addCase(listMyAuditLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listMyAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload as Account[]
      })
      .addCase(listMyAuditLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: listMyAuditLogs'
      })
      .addCase(logoutAllDevices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutAllDevices.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(logoutAllDevices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: logoutAllDevices'
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: refreshAccessToken'
      })
      .addCase(logoutSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutSession.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(logoutSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: logoutSession'
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: forgotPassword'
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: resetPassword'
      })
  },
})

export const { clearAccountError, setCurrentAccount } = accountSlice.actions
export default accountSlice.reducer
