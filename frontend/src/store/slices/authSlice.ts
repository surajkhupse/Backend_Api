import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  clearStoredTokens,
  persistTokens,
  readPersistedAuth,
  setRememberMe,
} from '../../features/auth/utils/authStorage'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface SetTokensPayload extends AuthTokens {
  rememberMe?: boolean
}

const persisted = readPersistedAuth()
if (persisted) {
  setRememberMe(persisted.rememberMe)
}
const persistedAuth: AuthTokens | null = persisted
  ? { accessToken: persisted.accessToken, refreshToken: persisted.refreshToken }
  : null

export const authSlice = createSlice({
  name: 'auth',
  initialState: persistedAuth as AuthTokens | null,
  reducers: {
    setTokens: (_state, action: PayloadAction<SetTokensPayload>) => {
      const { accessToken, refreshToken, rememberMe = false } = action.payload
      persistTokens(accessToken, refreshToken, rememberMe)
      return { accessToken, refreshToken }
    },
    clearTokens: () => {
      clearStoredTokens()
      return null
    },
  },
})

export const { setTokens, clearTokens } = authSlice.actions
export default authSlice.reducer
