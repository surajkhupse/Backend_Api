import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  clearStoredTokens,
  persistTokens,
  readStoredToken,
} from '../../utils/authStorage'
import { AUTH_STORAGE_KEYS } from '../../constants'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface SetTokensPayload extends AuthTokens {
  rememberMe?: boolean
}

const access = readStoredToken(AUTH_STORAGE_KEYS.accessToken)
const refresh = readStoredToken(AUTH_STORAGE_KEYS.refreshToken)
const persistedAuth: AuthTokens | null =
  access && refresh ? { accessToken: access, refreshToken: refresh } : null

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
