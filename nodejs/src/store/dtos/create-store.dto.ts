import z from "zod";
import { STORE_TYPES } from "../store-type.constants";


export const createStoreZodSchema = z.object({
    store_name:z.string().trim().max(30,'Store name must be less than 30 characters.'),
    location:z.string().trim(),
    store_type:z.enum(STORE_TYPES).optional()
})

export type CreateStoreDto = z.infer<typeof createStoreZodSchema> & {image?:{url:string,public_id:string}}
