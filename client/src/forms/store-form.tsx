import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { storeSchema, type StoreSchema } from '@/schemas/store'
import type { Store } from '@/types/store'

interface StoreFormProps {
  initialValues?: Store
  isLoading?: boolean
  onSubmit: (values: StoreSchema) => Promise<void> | void
}

export function StoreForm({ initialValues, isLoading = false, onSubmit }: StoreFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StoreSchema>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      store_name: initialValues?.store_name ?? '',
      location: initialValues?.location ?? '',
      store_type: initialValues?.store_type ?? '',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      <Input label="Store Name" error={errors.store_name?.message} {...register('store_name')} />
      <Input label="Location" error={errors.location?.message} {...register('location')} />
      <Input label="Store Type" error={errors.store_type?.message} {...register('store_type')} />
      <Input
        label="Store Image"
        type="file"
        accept="image/*"
        error={errors.image_file?.message as string | undefined}
        onChange={(event) => {
          setValue('image_file', event.target.files?.[0] ?? null, {
            shouldValidate: true,
          })
        }}
      />
      <p className="text-xs text-stone-500 dark:text-stone-400">
        The backend store controller is incomplete today, but this form is already aligned to the existing Nest store DTOs and service layer.
      </p>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        {initialValues ? 'Update Store' : 'Create Store'}
      </Button>
    </form>
  )
}
