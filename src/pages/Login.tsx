import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type LoginFormData, LoginSchema } from "@/schemas/LoginSchema";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const Login = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await api.post("/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data)
      if (data.response == "success") {
        const user = {
          user_id: data.user_id, 
          email: data.email,
          name:data.name,
        };
        setAuth(user, data.token, data.type);
        toast.success("Login Successfully");
        navigate("/");
      } else {
        toast.error(`${data.error}`);
      }
    },
    onError: (err) => {
      console.error("Login failed:", err.message);
      toast.error(`${err.message}`);
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (formData) => {
    mutate(formData);
  };
  if (isError) {
    toast.error("Internal server error");
  }

  return (
    <div className="p-10 w-100 flex flex-col mx-auto">
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="mb-5">Welcome to RFP System!</h1>
        <h1 className="mb-4">Login</h1>
        <Card className="p-5">
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
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
            <div>
              <div
                className="cursor-pointer hover:underline mb-1"
                onClick={() => navigate("/register-admin")}
              >
                Register as Admin
              </div>
              <div
                className="cursor-pointer hover:underline"
                onClick={() => navigate("/register-vendor")}
              >
                Register as Vendor
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default Login;
