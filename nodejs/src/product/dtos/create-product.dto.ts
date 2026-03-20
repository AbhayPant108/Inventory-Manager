import { z } from 'zod';

// 1. Define the Zod Schema for creating a Product
export const createProductSchema = z.object({
  product_name: z
    .string('Product name is required' )
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name cannot exceed 100 characters')
    .trim(),

  description: z
    .string('Description is required')
    .min(10, 'Description should be comprehensive (min 10 characters)')
    .trim(),

  image: z
    .object({
      url:z
      .url('Image url is required.'),
      public_id:z
      .string('Public Id is required.')
    })
    .optional(), // Maps to the false requirement in Mongoose

  price: z.coerce
    .number('Price is required')
    .nonnegative('Price cannot be negative'), // Matches the min: 0 Mongoose rule

  category: z
    .string('Category is required')
    .trim(),
});



// 3. Export TypeScript types inferred directly from the Zod schemas
export type CreateProductDto = z.infer<typeof createProductSchema>;
