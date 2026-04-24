import { z } from 'zod';

export const querySupplierSchema = z.object({
  supplier_name: z.string().trim().optional(),
  contact_person: z.string().trim().optional(),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

export type QuerySupplierDto = z.infer<typeof querySupplierSchema>;
