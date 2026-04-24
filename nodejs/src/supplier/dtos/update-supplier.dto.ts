import { z } from 'zod';
import { createSupplierZodSchema } from './create-supplier.dto';

export const updateSupplierZodSchema = createSupplierZodSchema.partial();

export type UpdateSupplierDto = z.infer<typeof updateSupplierZodSchema>;
