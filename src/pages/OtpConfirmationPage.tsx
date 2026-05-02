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
import { OtpConfirmationSchema, type OtpConfirmationData } from "@/schemas/OtpConfiramtionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const OtpConfiramtionPage = () => {
const navigate = useNavigate();
  const form = useForm<OtpConfirmationData>({
    resolver: zodResolver(OtpConfirmationSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      new_password:"",
      otp:""
    },
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: OtpConfirmationData) => {
      const res = await api.post("/confirmotpresetPassword", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.response == "success") {
        toast.success("New Password set Successfully");
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

  const onSubmit: SubmitHandler<OtpConfirmationData> = async (formData) => {
     mutate(formData);
  };

  if (isError) {
    toast.error("Internal server error");
  }

  return (
    <div className="w-80 items-center mx-auto mt-20">
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
         <h1 className="mb-5 flex justify-center">Otp Confirmation</h1>
        <h1 className="mb-4"></h1>
        <Card className="p-4">
          <FieldGroup>
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
            <Controller
              name="new_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>New Password</FieldLabel>
                  <Input {...field} placeholder="Enter new password" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Otp</FieldLabel>
                  <Input {...field} placeholder="Enter Otp" />
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
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate(-1)}
          >
            Previous Page
          </span>
        </Card>
      </form>
    </div>
  )
}

export default OtpConfiramtionPage
