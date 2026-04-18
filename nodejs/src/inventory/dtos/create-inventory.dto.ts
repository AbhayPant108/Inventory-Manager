import { z } from 'zod';
import { INVENTORY_STATUSES } from '../inventory.constants';

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid MongoDB ObjectId.');

const nonNegativeWholeNumberSchema = z.coerce
  .number()
  .nonnegative('Value must be zero or greater.')
  .refine(Number.isInteger, 'Value must be a whole number.');

export const inventoryBaseSchema = z.object({
  store_id: objectIdSchema,
  supplier_id: objectIdSchema,
  product_id: objectIdSchema,
  quantity: nonNegativeWholeNumberSchema,
  reserved_quantity: nonNegativeWholeNumberSchema,
  low_stock_threshold: nonNegativeWholeNumberSchema,
  status: z.enum(INVENTORY_STATUSES).optional(),
  location_in_store: z
    .string()
    .trim()
    .min(1, 'Location in store is required.')
    .max(120, 'Location in store cannot exceed 120 characters.'),
});

export const createInventorySchema = inventoryBaseSchema
  .refine((data) => data.reserved_quantity <= data.quantity, {
    path: ['reserved_quantity'],
    message: 'Reserved quantity cannot exceed total quantity.',
  });

export type CreateInventoryDto = z.infer<typeof createInventorySchema>;
