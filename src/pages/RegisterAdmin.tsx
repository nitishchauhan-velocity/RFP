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
  RegisterAdminSchema,
  type RegisterAdminData,
} from "@/schemas/RegisterAdminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterAdminData>({
    resolver: zodResolver(RegisterAdminSchema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      mobile: "",
    },
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: RegisterAdminData) => {
      const res = await api.post("/registeradmin", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.response == "success") {
        toast.success("Admin Register Successfully");
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

  const onSubmit: SubmitHandler<RegisterAdminData> = async (formData) => {
    mutate(formData);
  };
  if (isError) {
    toast.error("Internal server error");
  }
  return (
    <div className="p-10 w-100 flex flex-col mx-auto">
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-5 flex justify-center">Welcome to RFP System!</h1>
        <h1 className="mb-4">Admin Register</h1>
        <Card className="p-5">
          <FieldGroup>
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input {...field} placeholder="Password" type="password" />
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
                  <FieldLabel>Phone</FieldLabel>
                  <Input {...field} placeholder="Phone no." />
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
              onClick={() => navigate("/register-vendor")}
            >
              Register as Vendor
            </span>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default RegisterAdmin;
