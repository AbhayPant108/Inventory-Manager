import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

const navigation = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/stores', label: 'Stores' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/suppliers', label: 'Suppliers' },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="glass-panel flex h-full flex-col gap-6 p-6">
      <div className="space-y-2">
        <div className="font-display text-2xl font-bold">Inventory OS</div>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Operations cockpit for products, stock, stores, and category hygiene.
        </p>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'block rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-stone-900 text-white dark:bg-emerald-400 dark:text-stone-950'
                  : 'text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-white/10',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-3xl bg-stone-950 px-4 py-5 text-stone-50 dark:bg-white/10">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-400 dark:text-stone-300">
          Backend Reality
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-200 dark:text-stone-200">
          Products are fully wired. Auth, stores, suppliers, and inventory are scaffolded around the current Nest code and surface backend gaps clearly when an endpoint is missing.
        </p>
      </div>
    </aside>
  )
}
