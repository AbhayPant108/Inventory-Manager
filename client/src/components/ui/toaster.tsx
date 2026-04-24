import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { removeToast } from '@/store/ui-slice'
import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion' // Use 'framer-motion' for standard imports

const variantClasses = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100',
  error: 'border-rose-600 bg-rose-100 text-rose-900 dark:border-rose-400/30 dark:bg-rose-900/40 dark:text-rose-100',
  info: 'border-stone-300 bg-white text-stone-900 dark:border-white/10 dark:bg-stone-950 dark:text-stone-50',
}

export function ToastCard({
  id,
  title,
  description,
  variant = 'info',
}: {
  id: string
  title: string
  description?: string
  variant?: 'success' | 'error' | 'info'
}) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      dispatch(removeToast(id))
    }, 4000)
    return () => window.clearTimeout(timeout)
  }, [dispatch, id])

  return (
    <motion.div
      // Animation Params
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
      layout // Smoothly slides other toasts up when one is removed
      className={cn(
        'w-full rounded-2xl border px-4 py-3 shadow-lg pointer-events-auto',
        variantClasses[variant],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{title}</p>
          {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
        </div>
        <button
          className="text-xs font-semibold uppercase tracking-[0.2em] hover:cursor-pointer hover:opacity-50 transition-opacity"
          onClick={() => dispatch(removeToast(id))}
        >
          Close
        </button>
      </div>
    </motion.div>
  )
}

export function Toaster() {
  const notifications = useAppSelector((state) => state.ui.notifications)

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence mode="popLayout"> 
        {notifications.map((notification) => (
          <ToastCard key={notification.id} {...notification} />
        ))}
      </AnimatePresence>
    </div>
  )
}