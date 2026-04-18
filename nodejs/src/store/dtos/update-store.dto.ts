import { CreateStoreDto, createStoreZodSchema } from "./create-store.dto";

export const updateStoreZodSchema = createStoreZodSchema.partial()
export type UpdateStoreDto = Partial<CreateStoreDto>