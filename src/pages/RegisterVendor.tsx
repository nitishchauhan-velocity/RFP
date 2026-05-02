import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  RegisterVendorSchema,
  type RegisterVendorData,
} from "@/schemas/RegisterVendorSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { Category } from "./Categories";
const RegisterVendor = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterVendorData>({
    resolver: zodResolver(RegisterVendorSchema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      revenue: [],
      category: "",
      no_of_employees: 0,
      pancard_no: "",
      gst_no: "",
      mobile: "",
    },
  });
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
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: RegisterVendorData) => {
      const payload = {
        ...data,
        revenue: data.revenue.join(","),
      };
      const res = await api.post("/registervendor", payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.response == "success") {
        toast.success("Vendor Register Successfully");
        navigate("/login");
      } else {
        toast.error(`${data.error}`);
      }
    },
    onError: (err) => {
      console.error("Login failed:", err.message);
      toast.error(`${err.message}`);
    },
  });

  const onSubmit: SubmitHandler<RegisterVendorData> = async (formData) => {
     mutate(formData);
  };

  if (isError) {
    toast.error("Internal server error");
  }
  return (
    <div className="px-80 py-10 w-full flex flex-col mx-auto">
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-5 flex justify-center">Welcome to RFP System!</h1>
        <h1 className="mb-4">Vendor Register</h1>
        <Card className="p-5">
          <FieldGroup>
            <div className="flex gap-4">
              <Controller
                name="firstname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>FirstName</FieldLabel>
                    <Input {...field} placeholder="Enter firstName" />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>LastName</FieldLabel>
                    <Input {...field} placeholder="Enter lastName" />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} placeholder="Enter Email" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="flex gap-4 justify-between">
              <div className="w-full">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        {...field}
                        placeholder="Password"
                        type="password"
                        className="mb-2"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="revenue"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Revenue</FieldLabel>
                      <Input
                        placeholder="Revenue"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="w-full">
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Category</FieldLabel>

                      <select
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="border p-1.5 rounded mb-2"
                        size={5} 
                      >
                        <option value="">Select Category</option>
                        {categories?.map((cat:any) => (
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
                <Controller
                  name="no_of_employees"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>No of Employees</FieldLabel>
                      <Input
                        value={field.value ?? ""}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="no of employees."
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
            <Controller
              name="pancard_no"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Pancard Details</FieldLabel>
                  <Input {...field} placeholder="pnacard_no" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="gst_no"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>GST No</FieldLabel>
                  <Input {...field} placeholder="gst_no" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="mobile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Mobile no</FieldLabel>
                  <Input {...field} placeholder="phone no" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            type="submit"
            disabled={!form.formState.isValid||isPending}
            className="disabled:opacity-50"
          >
            {isPending?"Submitting...":"Submit"}
          </Button>
          <div className="flex w-full justify-between text-sm">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
            <span
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/register-admin")}
            >
              Register as Admin
            </span>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default RegisterVendor;
