import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  adjustStockSchema,
  stockQuantitySchema,
  type AdjustStockSchema,
  type StockQuantitySchema,
} from '@/schemas/inventory'

interface StockActionFormProps {
  action: 'restock' | 'reserve' | 'release' | 'consume' | 'adjust'
  isLoading?: boolean
  onSubmit: (values: AdjustStockSchema | StockQuantitySchema) => Promise<void> | void
}

export function StockActionForm({
  action,
  isLoading = false,
  onSubmit,
}: StockActionFormProps) {
  const isAdjust = action === 'adjust'
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: zodResolver(isAdjust ? adjustStockSchema : stockQuantitySchema) as any,
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) =>
        onSubmit(values as unknown as AdjustStockSchema | StockQuantitySchema),
      )}
    >
      <Input
        label={isAdjust ? 'Quantity Change' : 'Quantity'}
        type="number"
        error={
          isAdjust
            ? (errors as { quantity_change?: { message?: string } }).quantity_change?.message
            : (errors as { quantity?: { message?: string } }).quantity?.message
        }
        {...register(isAdjust ? 'quantity_change' : 'quantity')}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Confirm {action.replace('-', ' ')}
      </Button>
    </form>
  )
}
