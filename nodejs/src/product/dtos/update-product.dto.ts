import { createProductSchema } from "./create-product.dto";
import z from "zod";

// Define the schema for updating a Product (all fields become optional)
export const updateProductSchema = createProductSchema.partial();
export type UpdateProductDto = z.infer<typeof updateProductSchema>;