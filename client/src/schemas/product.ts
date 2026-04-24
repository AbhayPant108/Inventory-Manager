import { z } from 'zod'

export const baseProductSchema = z.object({
  product_name: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters.')
    .max(100, 'Product name cannot exceed 100 characters.'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0, 'Price cannot be negative.'),
  category: z.string().trim().min(1, 'Category is required.'),
  product_image: z.any().optional(),
})

export const createProductSchema = baseProductSchema.refine(
  (value) => value.product_image instanceof File,
  {
    path: ['product_image'],
    message: 'Product image is required.',
  },
)

export const updateProductSchema = baseProductSchema
  .partial()
  .refine(
    (value) =>
      value.product_image === undefined ||
      value.product_image === null ||
      value.product_image instanceof File,
    {
      path: ['product_image'],
      message: 'Product image must be a file.',
    },
  )

export type CreateProductSchema = z.infer<typeof createProductSchema>
export type UpdateProductSchema = z.infer<typeof updateProductSchema>
