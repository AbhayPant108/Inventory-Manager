import { z } from 'zod';

const positiveWholeNumberSchema = z.coerce
  .number()
  .positive('Quantity must be greater than zero.')
  .refine(Number.isInteger, 'Quantity must be a whole number.');

export const stockQuantitySchema = z.object({
  quantity: positiveWholeNumberSchema,
});

export type StockQuantityDto = z.infer<typeof stockQuantitySchema>;

export const adjustInventorySchema = z.object({
  quantity_change: z.coerce
    .number()
    .refine(Number.isInteger, 'Quantity change must be a whole number.')
    .refine((value) => value !== 0, 'Quantity change cannot be zero.'),
});

export type AdjustInventoryDto = z.infer<typeof adjustInventorySchema>;
