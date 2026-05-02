import z from "zod";

export const RegisterVendorSchema = z.object({
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
  revenue: z
    .array(
      z
        .string()
        .trim()
        .regex(/^\d+(\.\d+)?$/, "Must be a positive numeric string")
        .refine((val) => parseFloat(val) > 0, "Revenue must be greater than 0"),
    )
    .length(3, "Last three years revenue required"),

  no_of_employees: z.number().int().positive(),
  category: z.string().trim().min(1,"Category is required"),
  pancard_no: z
    .string()
    .trim()
    .length(10, "Check the pancard it must have 10 characters"),
  gst_no: z.string().trim(),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone must contain 10 digits"),
});

export type RegisterVendorData = z.input<typeof RegisterVendorSchema>;
