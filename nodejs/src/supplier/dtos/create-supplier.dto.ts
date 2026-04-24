import { z } from 'zod';

const optionalTrimmedString = z.string().trim().min(1).optional();

export const createSupplierZodSchema = z.object({
  supplier_name: z
    .string()
    .trim()
    .min(2, 'Supplier name must be at least 2 characters.')
    .max(80, 'Supplier name must not exceed 80 characters.'),
  contact_person: optionalTrimmedString,
  email: z.email('Email must be valid.').optional(),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone must be at least 7 characters.')
    .max(20, 'Phone must not exceed 20 characters.')
    .optional(),
  address: z
    .string()
    .trim()
    .max(200, 'Address must not exceed 200 characters.')
    .optional(),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must not exceed 500 characters.')
    .optional(),
});

export type CreateSupplierDto = z.infer<typeof createSupplierZodSchema>;
