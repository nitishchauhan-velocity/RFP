import api from "@/api/api";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  AddCategorySchema,
  type AddCategoryFormData,
} from "@/schemas/AddCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createColumnHelper,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export type Category = {
  id: number;
  name: string;
  status: "Active" | "Inactive";
};
type UpdateCategoryPayload = {
  name:string,
  status:0|1
}
type UpdateCategoryInput = {
  id: number;
  data: UpdateCategoryPayload;
};
const columnHelper = createColumnHelper<Category>();
const Categories = () => {
  const navigate  = useNavigate();
  const queryClient = useQueryClient();
  const [Open, setOpen] = useState(false);
  const form = useForm<AddCategoryFormData>({
    resolver: zodResolver(AddCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (data: AddCategoryFormData) => {
      const res = await api.post("/categories", data);
      console.log(res.data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.response == "success") {
        toast.success("Category Added Successfully");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast.error(`${data.error}`);
      }
    },
    onError: (err) => {
      console.error("Login failed:", err.message);
      toast.error(`${err.message}`);
    },
  });

  const onSubmit: SubmitHandler<AddCategoryFormData> = async (formData) => {
    await mutate(formData);
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading } = useQuery<{
    data: Category[];
    total: number;
  }>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      const categoryObject = res.data.categories;
      const categoryArray = Object.values(categoryObject) as Category[];
      return {
        data: categoryArray,
        total: categoryArray.length,
      };
    },
    placeholderData: keepPreviousData,
  });
  const updateCategory = useMutation({
    mutationFn: async ({id,data}:UpdateCategoryInput) => {
      const res = await api.put(`categories/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.response == "success") {
        toast.success("Category updated Successfully");
        
      } else {
        toast.error(`${data.errors}`);
      }
    },
    onError: (error) => {
      toast.error("Failed to update category");
      console.error(error);
    },
  });
  const CategoryColumns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return pageIndex * pageSize + row.index + 1;
        },
      }),
      columnHelper.accessor("name", {
        id: "Name",
        header: "Name",
      }),
      columnHelper.accessor("status", {
        header: "Category Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const color =
            status === "Active"
              ? "bg-green-300 text-green-800"
              : status === "Inactive"
                ? "bg-red-300 text-red-800"
                : "bg-gray-200 text-gray-800";
          return (
            <span className={`px-2 py-1 rounded text-sm ${color}`}>
              {status}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "Action",
        header: "Action",
        cell: ({ row }) => {
          const category = row.original;
          const status = category.status;
          return (
            <>
              {status === "Active" ? (
                <Button
                className=" cursor-pointer"
                  onClick={() =>
                    updateCategory.mutate({
                      id: category.id,
                      data: {
                        name: category.name,
                        status: 0,
                      },
                    })
                  }
                >
                  Inactive
                </Button>
              ) : (
                <Button
                className=" cursor-pointer"
                  onClick={() =>
                    updateCategory.mutate({
                      id: category.id,
                      data: {
                        name: category.name,
                        status: 1,
                      },
                    })
                  }
                >
                  Active
                </Button>
              )}
            </>
          );
        },
      }),
    ],
    [],
  );
  if (isLoading) return <div>Loading categories...</div>;
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold mb-4">Categories</h1>
        <Button onClick={() => setOpen(true)} className="bg-green-500">
          +Add Category
        </Button>
      </div>
      <DataTable<Category>
        columns={CategoryColumns}
        data={data?.data || []}
        state={{ pagination, sorting }}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      />
      <Dialog open={Open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Details</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Category Name</FieldLabel>
                    <Input {...field} placeholder="Enter Category name" />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="cursor-pointer" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
