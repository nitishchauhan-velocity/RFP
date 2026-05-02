import z from 'zod';

export const AddCategorySchema = z.object({
    name:z.string().trim().min(1,"Required"),
})

export type AddCategoryFormData = z.infer<typeof AddCategorySchema>