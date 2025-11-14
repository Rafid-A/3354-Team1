import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { login as loginApi } from "@/api/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

const formSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().nonempty("Please enter your password"),
});

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (e) => {
    try {
      const data = await loginApi(e.email, e.password);
      login(data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center space-y-12 p-6 min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center">
          <CardTitle className="text-3xl">Welcome Back</CardTitle>

          <CardDescription className="text-md">Login to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input {...field} id="email" placeholder="hello@example.com" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>

                        <a
                          href="#"
                          className="inline-block ml-auto text-gray-600 text-sm hover:underline underline-offset-4"
                        >
                          Forgot your password?
                        </a>
                      </div>

                      <Input {...field} id="password" type="password" placeholder="••••••••" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {error && <FieldError className="self-center" errors={[{ message: error }]} />}
                <Field>
                  <Button type="submit" size="lg">
                    Login
                  </Button>

                  <FieldDescription className="text-center">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
