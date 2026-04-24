import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/hooks/use-auth'
import { useAppDispatch } from '@/hooks/redux'
import { setSidebarOpen } from '@/store/ui-slice'

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Track stock health, catalog spread, and backend readiness at a glance.',
  },
  '/products': {
    title: 'Products',
    subtitle: 'Manage catalog items, pricing, search, and category assignments.',
  },
  '/categories': {
    title: 'Categories',
    subtitle: 'Curate category labels used by products and keep taxonomy consistent.',
  },
  '/stores': {
    title: 'Stores',
    subtitle: 'Manage store metadata and locations aligned to backend store records.',
  },
  '/inventory': {
    title: 'Inventory',
    subtitle: 'Monitor quantity, reservations, low-stock thresholds, and stock actions.',
  },
  '/suppliers': {
    title: 'Suppliers',
    subtitle: 'Supplier backend support is incomplete, but the UI is ready to adopt it.',
  },
}

export function Topbar() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { user, signOut } = useAuth()

  const current = titles[location.pathname] ?? {
    title: 'Inventory Manager',
    subtitle: 'Operations overview',
  }

  return (
    <header className="glass-panel flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <Button
          variant="secondary"
          className="lg:hidden"
          onClick={() => dispatch(setSidebarOpen(true))}
        >
          Menu
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold">{current.title}</h1>
          <p className="text-sm text-stone-600 dark:text-stone-300">{current.subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl bg-stone-100 px-4 py-2 text-sm text-stone-700 dark:bg-white/10 dark:text-stone-200">
          {user ? `Signed in as ${user.email}` : 'No active session'}
        </div>
        <ThemeToggle />
        <Button variant="ghost" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </header>
  )
}
