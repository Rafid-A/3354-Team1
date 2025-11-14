import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { signup as signupApi } from "@/api/auth";
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

const formSchema = z.object({
  name: z.string().min(2, "The name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "The password must be at least 6 characters"),
});

const Signup = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
    // mode: "onBlur",
  });

  const handleSubmit = async (e) => {
    try {
      const data = await signupApi(e.name, e.email, e.password);
      login(data);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center space-y-12 p-6 min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center">
          <CardTitle className="text-3xl">Sign Up</CardTitle>

          <CardDescription className="text-md">Create a new account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>

                      <Input {...field} id="name" placeholder="Max Verstappen" />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

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
                      <FieldLabel htmlFor="password">Password</FieldLabel>

                      <Input {...field} id="password" type="password" placeholder="••••••••" />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {error && <FieldError className="self-center" errors={[{ message: error }]} />}

                <Field>
                  <Button type="submit" size="lg">
                    Sign Up
                  </Button>

                  <FieldDescription className="text-center">
                    Already have an account? <Link to="/login">Login</Link>
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

export default Signup;
