import z from 'zod';

export const LoginSchema = z.object({
    email:z.string().trim().email("Invalid email"),
    password:z.string().trim().min(6,"Length must be greater than 6")
})

export type LoginFormData = z.infer<typeof LoginSchema>