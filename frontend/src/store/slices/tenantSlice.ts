import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { getTenants } from '../../api/generated/tenants/tenants'
import type {
  ChangeTenantStatusBodyStatus,
  CreateTenantBody,
} from '../../api/generated/models'

const tenantsApi = getTenants()

export interface Tenant {
  _id: string
  name: string
  slug: string
  domain?: string
  status: 'active' | 'inactive' | 'suspended'
  owner: string
  settings: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface TenantState {
  tenants: Tenant[]
  currentTenant: Tenant | null
  loading: boolean
  error: string | null
}

const initialState: TenantState = {
  tenants: [],
  currentTenant: null,
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

export const fetchTenants = createAsyncThunk<Tenant[], void, { rejectValue: string }>(
  'tenants/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = (await tenantsApi.listTenants()) as unknown as { tenants: Tenant[] }
      return data.tenants
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed to load tenants'))
    }
  },
)

export const createTenant = createAsyncThunk<Tenant, CreateTenantBody, { rejectValue: string }>(
  'tenants/create',
  async (body, { rejectWithValue }) => {
    try {
      const data = (await tenantsApi.createTenant(body)) as unknown as { tenant: Tenant }
      return data.tenant
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed to create tenant'))
    }
  },
)

export const changeTenantStatus = createAsyncThunk<
  Tenant,
  { id: string; status: ChangeTenantStatusBodyStatus },
  { rejectValue: string }
>('tenants/changeStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const data = (await tenantsApi.changeTenantStatus(id, { status })) as unknown as {
      tenant: Tenant
    }
    return data.tenant
  } catch (err) {
    return rejectWithValue(extractError(err, 'Failed to update tenant status'))
  }
})

export const deleteTenant = createAsyncThunk<string, { id: string }, { rejectValue: string }>(
  'tenants/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      await tenantsApi.deleteTenant(id)
      return id
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed to delete tenant'))
    }
  },
)

export const fetchTenantById = createAsyncThunk<Tenant, { id: string }, { rejectValue: string }>(
  'tenants/fetchById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = (await tenantsApi.getTenantById(id)) as unknown as { tenant: Tenant }
      return data.tenant
    } catch (err) {
      return rejectWithValue(extractError(err, 'Tenant not found'))
    }
  },
)

export const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    clearTenantError(state) {
      state.error = null
    },
    setCurrentTenant(state, action: PayloadAction<Tenant | null>) {
      state.currentTenant = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false
        state.tenants = action.payload
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load tenants'
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.tenants.unshift(action.payload)
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to create tenant'
      })
      .addCase(changeTenantStatus.fulfilled, (state, action) => {
        const idx = state.tenants.findIndex((t) => t._id === action.payload._id)
        if (idx !== -1) state.tenants[idx] = action.payload
      })
      .addCase(changeTenantStatus.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to update status'
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.tenants = state.tenants.filter((t) => t._id !== action.payload)
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete tenant'
      })
      .addCase(fetchTenantById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.loading = false
        state.currentTenant = action.payload
      })
      .addCase(fetchTenantById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Tenant not found'
      })
  },
})

export const { clearTenantError, setCurrentTenant } = tenantSlice.actions
export default tenantSlice.reducer
