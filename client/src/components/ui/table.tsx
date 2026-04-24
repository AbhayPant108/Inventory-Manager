import type { ReactNode } from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'

export interface TableColumn<T> {
  key: string
  header: string
  className?: string
  cell: (row: T) => ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  rowKey: (row: T) => string
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  loading = false,
  emptyTitle = 'No data found',
  emptyDescription = 'Try changing your filters or adding a new record.',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="glass-panel overflow-hidden">
        <div className="space-y-3 p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-200/80 bg-stone-50/70 dark:border-white/10 dark:bg-white/5">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 font-medium text-stone-600 dark:text-stone-300',
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-stone-100 last:border-transparent dark:border-white/5"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 align-top">
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
