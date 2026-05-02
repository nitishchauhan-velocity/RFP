import z from "zod";

export const CreateRfpSchema = z.object({
  item_name: z.string().trim().min(2, "Required item Name"),
  rfp_no: z.string().trim(),
  quantity: z.number().positive(),
  last_date: z.coerce.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    {
      message: "Last date must be today or in the future",
    },
  ),
  minimum_price: z
    .number()
    .positive({ message: "Min Price must be greater than zero" }),
  maximum_price: z
    .number()
    .positive({ message: "Max Price must be greater than zero" }),
  categories: z.string().trim(),
  // vendors: z.string().trim(),
  vendors: z
    .array(z.string())
    .min(1, "Select at least one vendor")
    .transform((arr) => arr.join(",")),
  item_description: z
    .string()
    .trim()
    .min(20, "Item description is more than 20 characters"),
});

export type CreateRfpFormData = z.input<typeof CreateRfpSchema>;
export type CreateRfpFormDataOutput = z.output<typeof CreateRfpSchema>;
export type CreateRfpFormDataInfer = z.infer<typeof CreateRfpSchema>;