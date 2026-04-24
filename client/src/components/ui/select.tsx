import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export function Select({
  label,
  error,
  className,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {label}
        </span>
      ) : null}
      <select
        className={cn(
          'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:border-stone-900 dark:border-white/10 dark:bg-white/5 dark:text-stone-50 dark:focus:border-emerald-400',
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </label>
  )
}
