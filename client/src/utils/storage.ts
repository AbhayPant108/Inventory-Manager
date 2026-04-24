import type { AuthUser } from '@/types/auth'
import type { ThemeMode } from '@/types/ui'

const AUTH_SESSION_KEY = 'inventory-manager.auth-session'
const THEME_KEY = 'inventory-manager.theme'
const CATEGORY_CATALOG_KEY = 'inventory-manager.category-catalog'

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function readAuthSession() {
  return safeJsonParse<AuthUser>(localStorage.getItem(AUTH_SESSION_KEY))
}

export function saveAuthSession(user: AuthUser) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY)
}

export function readTheme() {
  return (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? 'light'
}

export function saveTheme(theme: ThemeMode) {
  localStorage.setItem(THEME_KEY, theme)
}

export function readCategoryCatalog() {
  return safeJsonParse<string[]>(localStorage.getItem(CATEGORY_CATALOG_KEY)) ?? []
}

export function saveCategoryCatalog(categories: string[]) {
  localStorage.setItem(CATEGORY_CATALOG_KEY, JSON.stringify(categories))
}
