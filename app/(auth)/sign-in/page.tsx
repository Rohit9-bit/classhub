"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export default function SignUpPage() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    try {
      console.log("Submitting data:", data);
      const signInResponse = await signIn("credentials", {
        identifier: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("Sign-in response:", signInResponse);

      if (signInResponse?.error) {
        toast.error("Invalid email or password. Please try again.");
      }

      if(signInResponse?.ok) {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md min-h-screen mx-auto flex flex-col justify-center gap-15">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-extrabold text-xl md:text-2xl">
            Login to your account
          </CardTitle>
          <CardDescription>
            Welcome! Please enter your details to login into your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-1"
                  >
                    <FieldLabel
                      htmlFor="signup-form-email"
                      className="font-semibold text-gray-800"
                    >
                      Email address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email address"
                      autoComplete="off"
                      className="placeholder:text-gray-500 rounded-sm shadow-none border border-gray-300 my-0 py-2"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-1"
                  >
                    <FieldLabel
                      htmlFor="signup-form-password"
                      className="font-semibold text-gray-800"
                    >
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                      className="placeholder:text-gray-500 rounded-sm shadow-none border border-gray-300 my-0 py-2"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            form="signup-form"
            className="w-full rounded-sm shadow-none border border-gray-300 my-0 py-2"
          >
            Login
          </Button>
          <div>
            <p className="text-gray-500 mt-2">
              Don't have an account?{" "}
              <a href="/sign-up" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
