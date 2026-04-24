import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="space-y-3 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-lg dark:bg-white/10">
        ..
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="text-sm text-stone-600 dark:text-stone-300">{description}</p>
      </div>
      {action}
    </Card>
  )
}
