import z, { string } from "zod";

// // Order Schema
// export const tableSchema = z.object({
//     name: z.string(),
//     description: z.string(),
//     capacity: z.number(),
//     status: z.string(),
// })
// export type tableSchemaValidation = z.infer<typeof tableSchema> & {id: string}



// Create & Update Schema
export const createOrderSchema = z.object({
    customer_name: z.string().min(1, 'Customer name is required'),
    table_id: z.string().min(1, 'Select a table'),
    status: z.string().min(1, 'Select a status'),
})
export type createOrderSchemaValidation = z.infer<typeof createOrderSchema>