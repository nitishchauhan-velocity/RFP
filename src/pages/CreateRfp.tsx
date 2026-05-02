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
  CreateRfpSchema,
  type CreateRfpFormData,
} from "@/schemas/CreateRfpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const CreateRfp = () => {
  const queryClient = useQueryClient();
  const [vendors, setVendors] = useState([]);
  useEffect(() => {
    const getVendors = async () => {
      try {
        const res = await api.get("/vendorlist");
        const vendors = res.data.vendors;
        setVendors(vendors);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    // console.log(vendors);
    getVendors();
  }, []);
  const navigate = useNavigate();
  const { category_id } = useParams();
  const endofToday = new Date();
  endofToday.setHours(23, 59, 59, 999);
  const form = useForm<CreateRfpFormData>({
    resolver: zodResolver(CreateRfpSchema),
    mode: "onChange",
    defaultValues: {
      item_name: "",
      rfp_no: "",
      quantity: 0,
      last_date: endofToday,
      minimum_price: 0,
      maximum_price: 0,
      categories: category_id,
      vendors: "",
      item_description: "",
    },
  });
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: CreateRfpFormData) => {
      const res = await api.post("/createrfp", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.response == "success") {
        toast.success("Rfp created Successfully");
        queryClient.invalidateQueries({ queryKey: ["Rfpforquotes"] });
        navigate("/rfp-list");
      } else {
        toast.error(`${data.response} ${data.error}`);
      }
    },
    onError: (err) => {
      console.error("Login failed:", err.message);
      toast.error(`${err.message}`);
    },
  });
  const onSubmit: SubmitHandler<CreateRfpFormData> = async (formData) => {
    mutate(formData);
  };
  const canclehandler = () => {
    navigate(-1);
  };
  if (isError) {
    toast.error("Internal server error");
  }
  return (
    <div className="px-80 py-10 w-full flex flex-col mx-auto">
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-5 flex justify-center"></h1>
        <h1 className="mb-4">Create RFP</h1>
        <Card className="p-5">
          <FieldGroup>
            <div className="flex gap-4">
              <Controller
                name="item_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Item Name</FieldLabel>
                    <Input {...field} placeholder="Enter Item Name" />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="rfp_no"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>RFP No</FieldLabel>
                    <Input {...field} placeholder="Enter RFP No" />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Quantity</FieldLabel>
                  <Input
                    value={field.value ?? ""}
                    type="number"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Enter Quantity"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="flex gap-4 justify-between">
              <div className="w-full">
                <Controller
                  name="last_date"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Last date</FieldLabel>
                      <Input
                        value={
                          field.value instanceof Date
                            ? field.value.toLocaleDateString('en-CA')
                            : field.value || ""
                        }
                        placeholder="last date"
                        onChange={field.onChange}
                        type="date"
                        className="mb-2"
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
                  name="minimum_price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Minimum Price</FieldLabel>
                      <Input
                        value={field.value ?? ""}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="Minimum price."
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="maximum_price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Maximum Price</FieldLabel>
                      <Input
                        value={field.value ?? ""}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="Maximum price."
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
              name="vendors"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Vendor</FieldLabel>

                  <select
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="border p-1.5 rounded mb-2"
                  >
                    <option value="">Select Vendor</option>
                    {vendors?.map((ven: any) => (
                      <option key={ven.user_id} value={String(ven.user_id)}>
                        {ven.name}
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
              name="item_description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Item Description</FieldLabel>
                  <Input {...field} placeholder="Item Description" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="disabled:opacity-50"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button onClick={() => canclehandler()}>cancel</Button>
        </Card>
      </form>
    </div>
  );
};

export default CreateRfp;
