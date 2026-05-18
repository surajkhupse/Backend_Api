import axios from 'axios'
import { AUTH_STORAGE_KEYS } from '../../constants'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'
import { readStoredToken } from '../../utils/authStorage'

const baseURL = getApiBaseUrl() || undefined

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = readStoredToken(AUTH_STORAGE_KEYS.accessToken)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
