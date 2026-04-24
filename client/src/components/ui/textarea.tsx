import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {label}
        </span>
      ) : null}
      <textarea
        className={cn(
          'min-h-28 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 dark:border-white/10 dark:bg-white/5 dark:text-stone-50 dark:placeholder:text-stone-500 dark:focus:border-emerald-400',
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </label>
  )
}
