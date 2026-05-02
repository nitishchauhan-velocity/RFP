import z from "zod";

export const RegisterAdminSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastname: z.string().trim().min(2, "Last name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().trim().min(6, "Password at least 6 characters"),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone must contain 10 digits"),
});

export type RegisterAdminData = z.infer<typeof RegisterAdminSchema>;
