import z from "zod";

// Login
export const loginSchema = z.object({
    email: z.email('Please enter valid email').min(1, 'Email is required'),
    password: z.string().min(8, 'Password is required'),
})
export type loginFormValidation = z.infer<typeof loginSchema>

// Create User
export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Please enter valid email').min(1, 'Email is required'),
    password: z.string().min(8, 'Password is required'),
    role: z.string().min(1, 'Role is required'),
    image_url: z.union([
        z.string(),
        z.instanceof(File), //Image File
    ]).optional(),
})
export type createUserFormValidation = z.infer<typeof createUserSchema>

// Update User
export const updateUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    image_url: z.union([
        z.string(),
        z.instanceof(File), //Image File
    ]),
})
export type updateUserFromValidation = z.infer<typeof updateUserSchema>