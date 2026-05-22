import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import auditFilterReducer from './slices/auditFilterSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    auditFilter: auditFilterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
