import z from 'zod';

export const ForgetPasswordSchema = z.object({
    email:z.string().trim().email("Invalid email"),
})

export type ForgetPasswordData = z.infer<typeof ForgetPasswordSchema>