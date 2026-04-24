import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { toggleTheme } from '@/store/ui-slice'

export function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)

  return (
    <Button variant="secondary" onClick={() => dispatch(toggleTheme())}>
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  )
}
