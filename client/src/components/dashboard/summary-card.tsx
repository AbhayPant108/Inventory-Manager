import { Card } from '@/components/ui/card'

interface SummaryCardProps {
  eyebrow: string
  title: string
  value: string
  detail: string
}

export function SummaryCard({ eyebrow, title, value, detail }: SummaryCardProps) {
  return (
    <Card className="space-y-4">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
        {eyebrow}
      </div>
      <div className="space-y-1">
        <p className="font-display text-3xl font-bold">{value}</p>
        <h3 className="text-sm font-medium text-stone-700 dark:text-stone-200">{title}</h3>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-300">{detail}</p>
    </Card>
  )
}
