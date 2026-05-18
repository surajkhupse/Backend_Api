import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  /** Flip when you add real app-wide state (session, feature flags, etc.). */
  ready: boolean
}

const initialState: AppState = {
  ready: true,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
})

export default appSlice.reducer
