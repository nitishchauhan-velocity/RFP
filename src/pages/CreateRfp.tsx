import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue } from "@/components/ui/combobox";
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
  type CreateRfpFormDataOutput,
} from "@/schemas/CreateRfpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { Vendor } from "./VendorsList";

const CreateRfp = () => {
  const queryClient = useQueryClient();
  const [vendors, setVendors] = useState<Vendor[]>([]);
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
    getVendors();
  }, []);
  const navigate = useNavigate();
  const { category_id } = useParams();
  const endofToday = new Date();
  endofToday.setHours(23, 59, 59, 999);
  const form = useForm<CreateRfpFormData,unknown,CreateRfpFormDataOutput>({
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
      vendors: [],
      item_description: "",
    },
  });
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: CreateRfpFormDataOutput) => {
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
  const onSubmit: SubmitHandler<CreateRfpFormDataOutput> = async (formData) => {
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
                             : typeof field.value === "string"
                            ? field.value 
                            :""
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
                  render={({ field, fieldState }) => {
                    const selectedValues: string[] = field.value || [];

                    return (
                      <Field>
                        <FieldLabel>Vendor</FieldLabel>

                        <Combobox
                          items={vendors || []}
                          multiple
                          value={selectedValues}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <ComboboxChips>
                            <ComboboxValue>
                              {selectedValues.map((val) => {
                                const ven = vendors?.find(
                                  (v: any) => String(v.user_id) === val,
                                );

                                return (
                                  <ComboboxChip key={val}>
                                    {ven?.name  || val}
                                  </ComboboxChip>
                                );
                              })}
                            </ComboboxValue>
                            <ComboboxChipsInput placeholder="Select Category" />
                          </ComboboxChips>
                          <ComboboxContent className="max-h-60 overflow-y-auto">
                            <ComboboxEmpty>No Vendors found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item: any) => (
                                <ComboboxItem
                                  key={item.user_id}
                                  value={String(item.user_id)}
                                >
                                  {item.name}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>

                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
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
          <div className=" cursor-pointer flex gap-4">
          <Button
            type="submit"
            disabled={!form.formState.isValid || isPending}
            className="disabled:opacity-50 bg-blue-500"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button className="cursor-pointer" onClick={() => canclehandler()}>cancel</Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreateRfp;
