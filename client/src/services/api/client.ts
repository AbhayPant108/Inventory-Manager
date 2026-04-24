import axios from 'axios'
import {store} from '../../store/index'
import type { ApiResponse } from '@/types/api'
import { clearUser } from '@/store/auth-slice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
})
api.defaults.withCredentials = true
api.interceptors.response.use(
  (response) => response, // If request is successful, do nothing
  (error) => {
    if (error.response && error.response.status === 401) {
      // 1. Clear LocalStorage
      
      // 2. Clear Redux State
      store.dispatch(clearUser());
      
      // 3. Optional: Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export function unwrapApiResults<T>(payload: ApiResponse<T> | T) {
  if (
    payload &&
    typeof payload === 'object' &&
    'results' in payload
  ) {
    return payload.results as T
  }

  return payload as T
}

export default api
