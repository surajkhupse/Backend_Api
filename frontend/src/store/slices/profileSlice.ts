import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { extractApiError } from '../../services/api/extractApiError'
import {
  getMyProfileApi,
  updateMyProfileApi,
  type ProfileRecord,
  type UpdateProfileBody,
} from '../../services/api/profileApi'

export type ProfileFormState = {
  name: string
  jobTitle: string
  bio: string
  avatar: string
  theme: 'light' | 'dark'
  publicProfile: boolean
  usageData: boolean
}

export function profileToForm(user: ProfileRecord): ProfileFormState {
  return {
    name: user.name ?? '',
    jobTitle: user.jobTitle ?? '',
    bio: user.bio ?? '',
    avatar: user.avatar ?? '',
    theme: user.theme === 'dark' ? 'dark' : 'light',
    publicProfile: user.publicProfile ?? true,
    usageData: user.usageData ?? false,
  }
}

type ProfileState = {
  data: ProfileRecord | null
  loading: boolean
  saving: boolean
  error: string | null
  saveSuccess: boolean
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  saving: false,
  error: null,
  saveSuccess: false,
}

export const fetchMyProfile = createAsyncThunk<ProfileRecord, void, { rejectValue: string }>(
  'profile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await getMyProfileApi()
    } catch (err) {
      return rejectWithValue(extractApiError(err, 'Failed to load profile'))
    }
  },
)

export const saveMyProfile = createAsyncThunk<
  ProfileRecord,
  UpdateProfileBody,
  { rejectValue: string }
>('profile/saveMyProfile', async (body, { rejectWithValue }) => {
  try {
    return await updateMyProfileApi(body)
  } catch (err) {
    return rejectWithValue(extractApiError(err, 'Failed to save profile'))
  }
})

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null
    },
    clearProfileSaveSuccess(state) {
      state.saveSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load profile'
      })
      .addCase(saveMyProfile.pending, (state) => {
        state.saving = true
        state.error = null
        state.saveSuccess = false
      })
      .addCase(saveMyProfile.fulfilled, (state, action) => {
        state.saving = false
        state.data = action.payload
        state.saveSuccess = true
      })
      .addCase(saveMyProfile.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Failed to save profile'
      })
  },
})

export const { clearProfileError, clearProfileSaveSuccess } = profileSlice.actions
export default profileSlice.reducer
