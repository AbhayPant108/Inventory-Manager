import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductSchema,
  type UpdateProductSchema,
} from '@/schemas/product'
import type { Product } from '@/types/product'

interface ProductFormProps {
  categories: string[]
  initialValues?: Product
  isLoading?: boolean
  onSubmit: (values: CreateProductSchema | UpdateProductSchema) => Promise<void> | void
}

export function ProductForm({
  categories,
  initialValues,
  isLoading = false,
  onSubmit,
}: ProductFormProps) {
  const isEditing = Boolean(initialValues?.id || initialValues?._id)
  const schema = isEditing ? updateProductSchema : createProductSchema
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      product_name: initialValues?.product_name ?? '',
      description: initialValues?.description ?? '',
      price: initialValues?.price ?? 0,
      category: initialValues?.category ?? '',
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) =>
        onSubmit(values as unknown as CreateProductSchema | UpdateProductSchema),
      )}
    >
      <Input
        label="Product Name"
        error={errors.product_name?.message as string | undefined}
        {...register('product_name')}
      />
      <Textarea
        label="Description"
        error={errors.description?.message as string | undefined}
        {...register('description')}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Price"
          type="number"
          step="0.01"
          error={errors.price?.message as string | undefined}
          {...register('price')}
        />
        <div className="space-y-2">
          <Input
            label="Category"
            list="category-options"
            error={errors.category?.message as string | undefined}
            {...register('category')}
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
      </div>
      <Input
        label={isEditing ? 'Replace Image (optional)' : 'Product Image'}
        type="file"
        accept="image/*"
        error={errors.product_image?.message as string | undefined}
        onChange={(event) => {
          setValue('product_image', event.target.files?.[0] ?? null, {
            shouldValidate: true,
          })
        }}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        {isEditing ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  )
}
