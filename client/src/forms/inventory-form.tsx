import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { inventorySchema, type InventorySchema } from '@/schemas/inventory'
import type { InventoryItem } from '@/types/inventory'
import type { Product } from '@/types/product'
import type { Store } from '@/types/store'

interface InventoryFormProps {
  products: Product[]
  stores: Store[]
  initialValues?: InventoryItem
  isLoading?: boolean
  onSubmit: (values: InventorySchema) => Promise<void> | void
}

export function InventoryForm({
  products,
  stores,
  initialValues,
  isLoading = false,
  onSubmit,
}: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: zodResolver(inventorySchema) as any,
    defaultValues: {
      store_id: initialValues?.store_id ?? '',
      supplier_id: initialValues?.supplier_id ?? '',
      product_id: initialValues?.product_id ?? '',
      quantity: initialValues?.quantity ?? 0,
      reserved_quantity: initialValues?.reserved_quantity ?? 0,
      low_stock_threshold: initialValues?.low_stock_threshold ?? 0,
      location_in_store: initialValues?.location_in_store ?? '',
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) =>
        onSubmit(values as unknown as InventorySchema),
      )}
    >
      <Select
        label="Store"
        placeholder="Select a store"
        error={errors.store_id?.message as string | undefined}
        options={stores.map((store) => ({
          label: `${store.store_name} / ${store.location}`,
          value: store.id ?? store._id ?? '',
        }))}
        {...register('store_id')}
      />
      <Select
        label="Product"
        placeholder="Select a product"
        error={errors.product_id?.message as string | undefined}
        options={products.map((product) => ({
          label: product.product_name,
          value: product.id ?? product._id ?? '',
        }))}
        {...register('product_id')}
      />
      <Input
        label="Supplier ID"
        placeholder="MongoDB ObjectId"
        error={errors.supplier_id?.message as string | undefined}
        {...register('supplier_id')}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="Quantity"
          type="number"
          error={errors.quantity?.message as string | undefined}
          {...register('quantity')}
        />
        <Input
          label="Reserved Quantity"
          type="number"
          error={errors.reserved_quantity?.message as string | undefined}
          {...register('reserved_quantity')}
        />
        <Input
          label="Low Stock Threshold"
          type="number"
          error={errors.low_stock_threshold?.message as string | undefined}
          {...register('low_stock_threshold')}
        />
      </div>
      <Input
        label="Location In Store"
        error={errors.location_in_store?.message as string | undefined}
        {...register('location_in_store')}
      />
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Supplier records are not implemented in the backend yet, so this field stays manual for now.
      </p>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        {initialValues ? 'Update Inventory Record' : 'Create Inventory Record'}
      </Button>
    </form>
  )
}
