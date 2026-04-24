import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/types/auth'
import { clearAuthSession, readAuthSession, saveAuthSession } from '@/utils/storage'

interface AuthState {
  user: AuthUser | null
  status: 'anonymous' | 'authenticated'
}

const persistedSession = readAuthSession()

const initialState: AuthState = {
  user: persistedSession ?? null,
  status: persistedSession?.is_authenticated ? 'authenticated' : 'anonymous',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(_state, action: PayloadAction<AuthUser>) {
      saveAuthSession(action.payload)

      return {
        user: action.payload,
        status: 'authenticated' as const,
      }
    },
    clearUser() {
      clearAuthSession()

      return {
        user: null,
        status: 'anonymous' as const,
      }
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
