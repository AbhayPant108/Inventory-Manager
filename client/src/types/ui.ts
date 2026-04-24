export type ThemeMode = 'light' | 'dark'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: 'success' | 'error' | 'info'
}
