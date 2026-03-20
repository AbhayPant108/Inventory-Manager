import z, { email } from "zod";

export const CreateUserZodSchema = z.object({
    username:z.string().max(30).trim(),
    email:z.email().trim(),
    password:z.string(),
    first_name:z.string().trim().max(20,'First name should not be more than 20 characters.'),
    last_name:z.string().trim().max(20,'Last name should not be more than 20 characters.'),
    avatar:z.url().optional(),
    // contact_number:z.object({ph_number:z.string().trim(),country_code:z.string()}).optional()
})

export type CreateUserDto = z.infer<typeof CreateUserZodSchema>