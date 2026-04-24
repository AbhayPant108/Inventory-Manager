import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setSidebarOpen } from '@/store/ui-slice'

export function AppLayout() {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)
  const dispatch = useAppDispatch()

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 md:px-6">
      <div className="pointer-events-none absolute inset-0 grid-sheen opacity-60" />
      <div className="relative grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 flex bg-stone-950/55 p-4 backdrop-blur-sm lg:hidden">
            <div className="w-full max-w-xs">
              <Sidebar onNavigate={() => dispatch(setSidebarOpen(false))} />
            </div>
            <button
              className="flex-1"
              aria-label="Close sidebar"
              onClick={() => dispatch(setSidebarOpen(false))}
            />
          </div>
        ) : null}
        <main className="space-y-4">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
