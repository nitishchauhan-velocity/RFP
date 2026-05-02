import z from 'zod';

export const AddRpfSelectCategorySchema = z.object({
    categories:z.string().trim().min(1,"required"),
})

export type AddRpfSelectCategoryFormData = z.infer<typeof AddRpfSelectCategorySchema>