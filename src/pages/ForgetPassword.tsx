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
  ForgetPasswordSchema,
  type ForgetPasswordData,
} from "@/schemas/ForgetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const form = useForm<ForgetPasswordData>({
    resolver: zodResolver(ForgetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: ForgetPasswordData) => {
      const res = await api.post("/forgetPassword", data);
      console.log(res.data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.response == "success") {
        toast.success("Otp sent Successfully");
        navigate("/otp-confirmation");
      } else {
        toast.error(`${data.error}`);
      }
    },
    onError: (err) => {
      console.error("Login failed:", err.message);
      toast.error(`${err.message}`);
    },
  });

  const onSubmit: SubmitHandler<ForgetPasswordData> = async (formData) => {
    mutate(formData);
  };

  if (isError) {
    return <span>Error:Internal server error</span>;
  }
  return (
    <div className="p-10 w-100 flex flex-col mx-auto">
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
         <h1 className="mb-5 flex justify-center">Forget Password</h1>
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
            onClick={() => navigate("/login")}
          >
            Login?
          </span>
        </Card>
      </form>
    </div>
  );
};

export default ForgetPassword;
