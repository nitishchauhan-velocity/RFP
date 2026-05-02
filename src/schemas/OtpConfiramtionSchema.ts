import z from 'zod';

export const OtpConfirmationSchema = z.object({
    email:z.string().trim().email("Invalid email"),
    new_password:z.string().trim().min(6,"Length must be greater than 6"),
    otp:z.string().length(4,"OTP must be 4 letters")
})

export type OtpConfirmationData = z.infer<typeof OtpConfirmationSchema>