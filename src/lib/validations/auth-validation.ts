import z from "zod";

// Login
export const loginSchemaValidation = z.object({
    email: z.email('Please enter valid email').min(1, 'Email is required'),
    password: z.string().min(8, 'Password is required'),
})
export type validationLoginForm = z.infer<typeof loginSchemaValidation>

// Create User
export const createUserSchemaValidation = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Please enter valid email').min(1, 'Email is required'),
    password: z.string().min(8, 'Password is required'),
    role: z.string().min(1, 'Role is required'),
    // image_url: z.union([
    //     z.string().min(1, 'Image URL is required'), //Image URL
    //     z.instanceof(File), //Image File
    // ]),
})
export type validationCreateUserForm = z.infer<typeof createUserSchemaValidation>