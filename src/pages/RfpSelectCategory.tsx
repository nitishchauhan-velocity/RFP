import api from "@/api/api";
import type { Category } from "./Categories";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  AddRpfSelectCategorySchema,
  type AddRpfSelectCategoryFormData,
} from "@/schemas/AddRfpListSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const RfpSelectCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await api.get("/categories");
        const categoryObject = res.data.categories;
        const categoryarray = Object.values(categoryObject) as Category[];
        setCategories(categoryarray);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // console.log(categories);
    getCategories();
  }, []);
  const form = useForm<AddRpfSelectCategoryFormData>({
    resolver: zodResolver(AddRpfSelectCategorySchema),
    mode: "onChange",
    defaultValues: {
      categories: "",
    },
  });
  const onSubmit: SubmitHandler<AddRpfSelectCategoryFormData> = async (
    formData,
  ) => {
    navigate(`/rfpcreate/${formData.categories}`);
  };
  const canclehandler=()=>{
    navigate(-1);
  }
  return (
    <div className="px-80 py-10 w-full flex flex-col mx-auto">
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-5 flex justify-center">RFP select Category!</h1>
        <Card className="p-5">
          <FieldGroup>
            <Controller
              name="categories"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Category</FieldLabel>

                  <select
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="border p-1.5 rounded mb-2"
                    size={10}
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="disabled:opacity-50 bg-blue-400"
            >
              Submit
            </Button>
            <Button onClick={()=>canclehandler()}>cancel</Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default RfpSelectCategory;
