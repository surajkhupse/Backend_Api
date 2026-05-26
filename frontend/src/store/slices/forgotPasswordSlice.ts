import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { getAccounts } from '../../api/generated/accounts'

const accountsApi = getAccounts()

export interface ForgotPasswordState {
  loading: boolean
  error: string | null
  submitted: boolean
  submittedEmail: string
}

const initialState: ForgotPasswordState = {
  loading: false,
  error: null,
  submitted: false,
  submittedEmail: '',
}

export const forgotPassword = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('forgotPassword/submit', async (email, { rejectWithValue }) => {
  try {
    const data = await accountsApi.forgotPassword({
      email: email.trim().toLowerCase(),
    })
    return data?.message ?? "If an account exists for that email, we've sent reset instructions."
  } catch (err) {
    if (isAxiosError(err)) {
      const d = err.response?.data as { message?: string } | undefined
      if (d && typeof d.message === 'string') return rejectWithValue(d.message)
      if (err.code === 'ERR_NETWORK') {
        return rejectWithValue('Cannot reach the API. Check the server and VITE_API_URL.')
      }
    }
    if (err instanceof Error) return rejectWithValue(err.message)
    return rejectWithValue('Something went wrong. Please try again.')
  }
})

export const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    resetForgotPassword: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.submittedEmail = action.meta.arg
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        state.submitted = true
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Something went wrong. Please try again.'
      })
  },
})

export const { resetForgotPassword } = forgotPasswordSlice.actions
export default forgotPasswordSlice.reducer
