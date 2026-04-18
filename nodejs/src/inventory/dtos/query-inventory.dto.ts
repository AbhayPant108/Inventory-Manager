import { z } from 'zod';
import { INVENTORY_STATUSES } from '../inventory.constants';

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid MongoDB ObjectId.');

const queryBooleanSchema = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((value) => value === true || value === 'true');

export const queryInventorySchema = z.object({
  store_id: objectIdSchema.optional(),
  supplier_id: objectIdSchema.optional(),
  product_id: objectIdSchema.optional(),
  status: z.enum(INVENTORY_STATUSES).optional(),
  location_in_store: z.string().trim().min(1).optional(),
  low_stock_only: queryBooleanSchema.optional(),
});

export type QueryInventoryDto = z.infer<typeof queryInventorySchema>;
