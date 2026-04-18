import z from "zod";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid MongoDB ObjectId.');

export const payloadSchema = z.object({
    id:objectIdSchema,
    username:z.string(),
    email:z.email()
})

export type PayloadDto = z.infer<typeof payloadSchema>