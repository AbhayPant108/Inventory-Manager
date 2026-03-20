import z from "zod";

const categoryEnum = ['Food','Good']
export const queryZodSchema = z.object({
    created_at:z.string(),
    updated_at:z.string(),
    product_name:z.string(),
    category:z.enum(categoryEnum),
    price:z.coerce.number().nonnegative('Price must not be negative.')
}).partial()

export type QueryDto = z.infer<typeof queryZodSchema>