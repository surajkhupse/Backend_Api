// @generated-from-service fdb91d3bb023f233
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { getEvents } from '../../api/generated/events/events'
import type {
  CreateEventInput,
} from '../../api/generated/models'

const eventsApi = getEvents()

// TODO: define the shape of your entity
export interface Event {
  _id: string
  createdAt: string
  updatedAt: string
}

export interface EventState {
  items: Event[]
  currentItem: Event | null
  loading: boolean
  error: string | null
}

const initialState: EventState = {
  items: [],
  currentItem: null,
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

/** List all events */
export const fetchEvents = createAsyncThunk<unknown, void, { rejectValue: string }>(
  'event/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const data = await eventsApi.getEvents()
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: getEvents'))
    }
  },
)

/** Create an event */
export const createEvent = createAsyncThunk<unknown, CreateEventInput, { rejectValue: string }>(
  'event/createEvent',
  async (createEventInput, { rejectWithValue }) => {
    try {
      const data = await eventsApi.createEvent(createEventInput)
      return data as unknown
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: createEvent'))
    }
  },
)

/** Delete an event by ID */
export const deleteEvent = createAsyncThunk<string, { id: string }, { rejectValue: string }>(
  'event/deleteEvent',
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await eventsApi.deleteEvent(id)
      return data as string
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: deleteEvent'))
    }
  },
)

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearEventError(state) {
      state.error = null
    },
    setCurrentEvent(state, action) {
      state.currentItem = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload as Event[]
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: getEvents'
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: createEvent'
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed: deleteEvent'
      })
  },
})

export const { clearEventError, setCurrentEvent } = eventSlice.actions
export default eventSlice.reducer
