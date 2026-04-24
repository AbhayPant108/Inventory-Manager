import { z } from 'zod'

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid MongoDB ObjectId.')

const wholeNumberSchema = z.coerce
  .number()
  .min(0, 'Value must be zero or greater.')
  .refine(Number.isInteger, 'Value must be a whole number.')

export const inventorySchema = z
  .object({
    store_id: objectIdSchema,
    supplier_id: objectIdSchema,
    product_id: objectIdSchema,
    quantity: wholeNumberSchema,
    reserved_quantity: wholeNumberSchema,
    low_stock_threshold: wholeNumberSchema,
    location_in_store: z
      .string()
      .trim()
      .min(1, 'Location in store is required.')
      .max(120, 'Location cannot exceed 120 characters.'),
  })
  .refine((value) => value.reserved_quantity <= value.quantity, {
    path: ['reserved_quantity'],
    message: 'Reserved quantity cannot exceed total quantity.',
  })

export const stockQuantitySchema = z.object({
  quantity: z.coerce
    .number()
    .positive('Quantity must be greater than zero.')
    .refine(Number.isInteger, 'Quantity must be a whole number.'),
})

export const adjustStockSchema = z.object({
  quantity_change: z.coerce
    .number()
    .refine(Number.isInteger, 'Quantity change must be a whole number.')
    .refine((value) => value !== 0, 'Quantity change cannot be zero.'),
})

export type InventorySchema = z.infer<typeof inventorySchema>
export type StockQuantitySchema = z.infer<typeof stockQuantitySchema>
export type AdjustStockSchema = z.infer<typeof adjustStockSchema>
