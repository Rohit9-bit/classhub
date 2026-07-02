"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import axios from "axios";

import { RefreshCwIcon } from "lucide-react";
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
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const SignUpFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(32, "Name must be at most 32 characters."),
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(32, "Password must be at most 32 characters."),
});

const OtpFormSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 characters.")
    .regex(/^\d+$/, "OTP must contain only digits."),
});

export default function SignInPage() {
  const [email, setEmail] = React.useState("");
  const [step, setStep] = React.useState<"signup" | "otp">("signup");
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(data: z.infer<typeof SignUpFormSchema>) {
    console.log(data);
    try {
      setEmail(data.email);
      const response = await axios.post("/api/sign-up", data);
      console.log(response.data);
      if (response.data.success) {
        toast.success(
          "An OTP has been sent to your email address. Please check your inbox.",
        );
      }
      setStep("otp");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  async function onOtpSubmit(data: z.infer<typeof OtpFormSchema>) {
    console.log(data);
    try {
      setOtp(data.otp);
      const response = await axios.post("/api/verify-otp", {
        email,
        otp: data.otp,
      });
      console.log(response.data);

      if (response.data.success) {
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  }

  return (
    <div>
      {step === "signup" && (
        <div className="w-full max-w-md min-h-screen mx-auto flex flex-col justify-center gap-15">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-extrabold text-xl md:text-2xl">
                Create your account
              </CardTitle>
              <CardDescription>
                Welcome! Please enter your details to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="flex flex-col">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex flex-col gap-1"
                      >
                        <FieldLabel
                          htmlFor="signup-form-name"
                          className="font-semibold text-gray-800"
                        >
                          Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="signup-form-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your name"
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
                Create Account
              </Button>
              <div>
                <p className="text-gray-500 mt-2">
                  Already have an account?{" "}
                  <a
                    href="/(auth)/sign-in"
                    className="text-blue-500 hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === "otp" && (
        <div className="w-full max-w-md min-h-screen mx-auto flex flex-col justify-center gap-15">
          <Card>
            <CardHeader>
              <CardTitle>Verify your email address</CardTitle>
              <CardDescription>
                Enter the verification code we sent to your email address:{" "}
                <span className="font-medium">{email}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="otp-verification-form"
                onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              >
                <Controller
                  name="otp"
                  control={otpForm.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="otp-verification">
                          Verification code
                        </FieldLabel>
                      </div>
                      <InputOTP
                        maxLength={6}
                        onChange={field.onChange}
                        id="otp-verification"
                        required
                        pattern={REGEXP_ONLY_DIGITS}
                      >
                        <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-10 *:data-[slot=input-otp-slot]:w-8 *:data-[slot=input-otp-slot]:text-xl">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator className="mx-2" />
                        <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-10 *:data-[slot=input-otp-slot]:w-8 *:data-[slot=input-otp-slot]:text-xl">
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <FieldDescription>
                        <a href="/(auth)/sign-up" className="text-blue-500 hover:underline">
                          I no longer have access to this email address.
                        </a>
                      </FieldDescription>
                    </Field>
                  )}
                />
              </form>
            </CardContent>
            <CardFooter>
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  form="otp-verification-form"
                >
                  Verify
                </Button>
                <div className="text-sm text-muted-foreground">
                  Having trouble signing in?{" "}
                  <a
                    href="#"
                    className="underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    Contact support
                  </a>
                </div>
              </Field>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
