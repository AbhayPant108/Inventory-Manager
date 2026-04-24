interface ChartDatum {
  label: string
  value: number
}

interface MiniBarChartProps {
  data: ChartDatum[]
}

export function MiniBarChart({ data }: MiniBarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-700 dark:text-stone-200">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
          <div className="h-2 rounded-full bg-stone-200 dark:bg-white/10">
            <div
              className="h-2 rounded-full bg-stone-900 transition-all dark:bg-emerald-400"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
