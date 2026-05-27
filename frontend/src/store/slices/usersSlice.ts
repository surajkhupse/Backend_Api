import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { extractApiError } from '../../services/api/extractApiError'
import { listUsersApi, type UserRecord } from '../../services/api/usersApi'

export type User = UserRecord

export interface UsersState {
  items: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
}

export const listUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/listUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await listUsersApi()
    } catch (err) {
      return rejectWithValue(extractApiError(err, 'Failed to load users'))
    }
  },
)

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load users'
      })
  },
})

export const { clearUsersError } = usersSlice.actions
export default usersSlice.reducer
