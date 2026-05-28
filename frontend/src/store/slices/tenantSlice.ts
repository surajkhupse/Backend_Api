import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  changeTenantStatusApi,
  createTenantApi,
  deleteTenantApi,
  impersonateTenantApi,
  listTenantsApi,
  type CreateTenantBody,
  type TenantImpersonationTokens,
  type TenantRecord,
  type TenantStatus,
} from '../../services/api/tenantsApi'
import { extractApiError } from '../../services/api/extractApiError'

export type Tenant = TenantRecord

export interface TenantState {
  items: Tenant[]
  currentItem: Tenant | null
  loading: boolean
  error: string | null
  actionTenantId: string | null
}

const initialState: TenantState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  actionTenantId: null,
}

export const createTenant = createAsyncThunk<Tenant, CreateTenantBody, { rejectValue: string }>(
  'tenant/createTenant',
  async (body, { rejectWithValue }) => {
    try {
      return await createTenantApi(body)
    } catch (err) {
      return rejectWithValue(extractApiError(err, 'Failed to create tenant'))
    }
  },
)

export const listTenants = createAsyncThunk<Tenant[], void, { rejectValue: string }>(
  'tenant/listTenants',
  async (_, { rejectWithValue }) => {
    try {
      return await listTenantsApi()
    } catch (err) {
      return rejectWithValue(extractApiError(err, 'Failed to load tenants'))
    }
  },
)

export const changeTenantStatus = createAsyncThunk<
  Tenant,
  { id: string; status: TenantStatus },
  { rejectValue: string }
>(
  'tenant/changeTenantStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await changeTenantStatusApi(id, status)
    } catch (err) {
      return rejectWithValue(extractApiError(err, 'Failed to update tenant status'))
    }
  },
)

export const deleteTenant = createAsyncThunk<string, { id: string }, { rejectValue: string }>(
  'tenant/deleteTenant',
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteTenantApi(id)
      return id
    } catch (err) {
      return rejectWithValue(extractApiError(err, 'Failed to delete tenant'))
    }
  },
)

export const impersonateTenant = createAsyncThunk<
  TenantImpersonationTokens,
  { id: string },
  { rejectValue: string }
>('tenant/impersonateTenant', async ({ id }, { rejectWithValue }) => {
  try {
    return await impersonateTenantApi(id)
  } catch (err) {
    return rejectWithValue(extractApiError(err, 'Failed to impersonate tenant'))
  }
})

export const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearTenantError(state) {
      state.error = null
    },
    setCurrentTenant(state, action: { payload: Tenant | null }) {
      state.currentItem = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTenant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.loading = false
        state.items = [action.payload, ...state.items]
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to create tenant'
      })
      .addCase(listTenants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listTenants.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(listTenants.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load tenants'
      })
      .addCase(changeTenantStatus.pending, (state, action) => {
        state.actionTenantId = action.meta.arg.id
        state.error = null
      })
      .addCase(changeTenantStatus.fulfilled, (state, action) => {
        state.actionTenantId = null
        const idx = state.items.findIndex((t) => t._id === action.payload._id)
        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(changeTenantStatus.rejected, (state, action) => {
        state.actionTenantId = null
        state.error = action.payload ?? 'Failed to update tenant status'
      })
      .addCase(deleteTenant.pending, (state, action) => {
        state.actionTenantId = action.meta.arg.id
        state.error = null
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.actionTenantId = null
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.actionTenantId = null
        state.error = action.payload ?? 'Failed to delete tenant'
      })
      .addCase(impersonateTenant.pending, (state, action) => {
        state.actionTenantId = action.meta.arg.id
        state.error = null
      })
      .addCase(impersonateTenant.fulfilled, (state) => {
        state.actionTenantId = null
      })
      .addCase(impersonateTenant.rejected, (state, action) => {
        state.actionTenantId = null
        state.error = action.payload ?? 'Failed to impersonate tenant'
      })
  },
})

export const { clearTenantError, setCurrentTenant } = tenantSlice.actions
export default tenantSlice.reducer
