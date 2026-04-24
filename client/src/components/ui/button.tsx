import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-stone-900 text-white hover:bg-stone-700 dark:bg-emerald-400 dark:text-stone-950 dark:hover:bg-emerald-300',
  secondary:
    'bg-white text-stone-900 hover:bg-stone-100 dark:bg-white/10 dark:text-stone-50 dark:hover:bg-white/15',
  ghost:
    'bg-transparent text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-white/10',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400',
}

export function Button({
  className,
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center hover:cursor-pointer justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </button>
  )
}
