import { useEffect } from 'react'
import { useAppSelector } from '@/hooks/redux'
import { saveTheme } from '@/utils/storage'

export function ThemeController() {
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    saveTheme(theme)
  }, [theme])

  return null
}
