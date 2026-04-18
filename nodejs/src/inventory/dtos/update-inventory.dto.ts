import { z } from 'zod';
import { inventoryBaseSchema } from './create-inventory.dto';

export const updateInventorySchema = inventoryBaseSchema
  .partial()
  .refine(
    (data) =>
      data.quantity === undefined ||
      data.reserved_quantity === undefined ||
      data.reserved_quantity <= data.quantity,
    {
      path: ['reserved_quantity'],
      message: 'Reserved quantity cannot exceed total quantity.',
    },
  );

export type UpdateInventoryDto = z.infer<typeof updateInventorySchema>;
