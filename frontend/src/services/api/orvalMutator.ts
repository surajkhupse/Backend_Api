import type { AxiosRequestConfig } from 'axios'
import { api } from './client'

/** Orval mutator — routes generated clients through the shared axios instance. */
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  api(config).then(({ data }) => data)
