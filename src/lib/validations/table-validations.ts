import z, { string } from "zod";

// Menu Schema
export const tableSchema = z.object({
    name: z.string(),
    description: z.string(),
    capacity: z.number(),
    status: z.string(),
})
export type tableSchemaValidation = z.infer<typeof tableSchema> & {id: string}

// Create & Update Table Schema
export const createupdateTableSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    capacity: z.string().min(1, 'Capacity is required'),
    status: z.string().min(1, 'Status is required'),
})
export type createupdateTableSchemaValidation = z.infer<typeof createupdateTableSchema>