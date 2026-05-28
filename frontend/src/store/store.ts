import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import auditReducer from './slices/auditSlice'
import authReducer from './slices/authSlice'
import forgotPasswordReducer from './slices/forgotPasswordSlice'
import tenantReducer from './slices/tenantSlice'
import usersReducer from './slices/usersSlice'
import accountReducer from './slices/accountSlice'
import eventReducer from './slices/eventSlice'
import profileReducer from './slices/profileSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    audit: auditReducer,
    forgotPassword: forgotPasswordReducer,
    tenants: tenantReducer,
    users: usersReducer,
    account: accountReducer,
    event: eventReducer,
    profile: profileReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
