import { cn } from '@/utils/cn'

interface BadgeProps {
  children: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const badgeClasses = {
  default: 'bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-stone-200',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
        badgeClasses[variant],
      )}
    >
      {children}
    </span>
  )
}
