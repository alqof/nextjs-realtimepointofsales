import z from "zod";

export const loginSchemaValidation = z.object({
    email: z.email('Please enter valid email').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
})

export type LoginState = z.infer<typeof loginSchemaValidation>