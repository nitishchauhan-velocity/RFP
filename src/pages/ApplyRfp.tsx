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
  ApplyRfpSchema,
  type ApplyRfpFormData,
} from "@/schemas/ApplyRfpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ApplyRfp = () => {
  const { rfp_id } = useParams();
  const navigate = useNavigate();
  const form = useForm<ApplyRfpFormData>({
    resolver: zodResolver(ApplyRfpSchema),
    mode: "onChange",
    defaultValues: {
      item_price: 0,
      total_cost: 0,
    },
  });
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: ApplyRfpFormData) => {
      const res = await api.put(`/rfp/apply/${rfp_id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.response == "success") {
        toast.success("Apply Successfully");
        navigate("/rfp-for-quotes");
      } else {
        toast.error(`${data.errors}`);
      }
    },
    onError: (err) => {
      console.error("Login failed:", err.message);
      toast.error(`${err.message}`);
    },
  });

  const onSubmit: SubmitHandler<ApplyRfpFormData> = async (formData) => {
    mutate(formData);
  };
  if (isError) {
    toast.error("Internal server error");
  }
  const canclehandler = () => {
    navigate("/rfp-for-quotes");
  };
  return (
    <div className="p-10 w-100 flex flex-col mx-auto">
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-5">Welcome to RFP System!</h1>
        <h1 className="mb-4">Apply For RFP</h1>
        <Card className="p-5">
          <FieldGroup>
            <Controller
                  name="item_price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Item Price</FieldLabel>
                      <Input
                        value={field.value ?? ""}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="Item Price."
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

            <Controller
                  name="total_cost"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Total Cost</FieldLabel>
                      <Input
                        value={field.value ?? ""}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="Total Cost."
                      />
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
            disabled={!form.formState.isValid || isPending}
            className=" cursor-pointer disabled:opacity-50 bg-blue-500"
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

export default ApplyRfp;
