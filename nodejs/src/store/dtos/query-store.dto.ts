import { z } from 'zod';
import { STORE_TYPES } from '../store-type.constants';



export const queryStoreSchema = z.object({
  store_name: z.string().trim().optional(),
  location: z.string().trim().optional(),
  store_type: z.enum(STORE_TYPES).optional(),
  
});

export type QueryStoreDto = z.infer<typeof queryStoreSchema>;
