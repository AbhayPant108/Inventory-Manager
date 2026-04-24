import { z } from 'zod'

export const storeSchema = z.object({
  store_name: z
    .string()
    .trim()
    .min(1, 'Store name is required.')
    .max(30, 'Store name must be less than 30 characters.'),
  location: z.string().trim().min(1, 'Location is required.'),
  store_type: z.string().trim().optional(),
  image_file: z.any().optional(),
})

export type StoreSchema = z.infer<typeof storeSchema>
