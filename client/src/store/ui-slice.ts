import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ThemeMode, ToastItem } from '@/types/ui'
import { readTheme } from '@/utils/storage'

interface UiState {
  theme: ThemeMode
  sidebarOpen: boolean
  notifications: ToastItem[]
}

const initialState: UiState = {
  theme: readTheme(),
  sidebarOpen: false,
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload
    },
    addToast: {
      prepare(payload: Omit<ToastItem, 'id'>) {
        return {
          payload: {
            ...payload,
            id: crypto.randomUUID(),
          },
        }
      },
      reducer(state, action: PayloadAction<ToastItem>) {
        state.notifications.push(action.payload)
      },
    },
    removeToast(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (toast) => toast.id !== action.payload,
      )
    },
  },
})

export const { addToast, removeToast, setSidebarOpen, setTheme, toggleTheme } =
  uiSlice.actions
export default uiSlice.reducer
