import z, { email } from "zod";

export const LoginUserZodSchema = z.object({
    email:z.email(),
    password:z.string(),
})

export type LoginUserDto = z.infer<typeof LoginUserZodSchema>