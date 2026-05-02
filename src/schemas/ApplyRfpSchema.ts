import z from 'zod'

export const ApplyRfpSchema  = z.object({
    item_price:z.number().positive({ message: "Price must be greater than zero" }),
    total_cost:z.number().positive({message: "Cost must be greater than zero"})
})

export type ApplyRfpFormData = z.infer<typeof ApplyRfpSchema>