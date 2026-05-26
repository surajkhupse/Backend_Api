import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import auditReducer from './slices/auditSlice'
import authReducer from './slices/authSlice'
import forgotPasswordReducer from './slices/forgotPasswordSlice'
import tenantReducer from './slices/tenantSlice'
import accountReducer from './slices/accountSlice'
import eventReducer from './slices/eventSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    audit: auditReducer,
    forgotPassword: forgotPasswordReducer,
    tenants: tenantReducer,
    account: accountReducer,
    event: eventReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
