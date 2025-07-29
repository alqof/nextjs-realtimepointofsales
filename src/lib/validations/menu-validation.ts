import z, { string } from "zod";

// Menu Schema
export const menuSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    discount: z.number(),
    category: z.string(),
    image_url: z.union([
        z.string(), 
        z.instanceof(File)
    ]).optional(),
    is_available: z.boolean(),
})
export type menuSchemaValidation = z.infer<typeof menuSchema> & {id: string}

// Create Menu Schema
export const createupdateMenuSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.string().min(1, 'Price is required'),
    discount: z.string().min(1, 'Discount is required'),
    category: z.string().min(1, 'Category is required'),
    image_url: z.union([
        z.string(),
        z.instanceof(File),
    ]).optional(),
    is_available: z.string().min(1, 'Availability is required'),
})
export type createupdateMenuSchemaValidation = z.infer<typeof createupdateMenuSchema>