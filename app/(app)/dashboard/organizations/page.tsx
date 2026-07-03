"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const organizationSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
});

const page = () => {
  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: "",
      description: "",
      slug: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof organizationSchema>) => {
    console.log("Form submitted:", data);
    try {
      const response = await axios.post("/api/organizations", data);
      if (response.data.success) {
        toast.success(
          response.data.message || "Organization created successfully",
        );
        form.reset();
      }
    } catch (error: any) {
      console.error(error.response?.data?.error);
      toast.error(
        error.response?.data.error || "Failed to create organization",
      );
    }
  };

  const organizationNameValue = form.watch("organizationName");

  React.useEffect(() => {
    if (organizationNameValue) {
      const generatedSlug = organizationNameValue
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      form.setValue("slug", generatedSlug);
    } else {
      form.setValue("slug", "");
    }
  }, [organizationNameValue, form]);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <p className="text-gray-600 text-sm">
          Manage your institutional spaces and academic collaborations.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Create a New Organization
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Establish a new hub for your department, school or study group.
                Fill in the details below to get started.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form id="organizationForm" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-10 justify-center h-38">
              <div className="w-1/2">
                <FieldGroup>
                  <Controller
                    name="organizationName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex flex-col gap-1"
                      >
                        <FieldLabel
                          htmlFor="organizationName"
                          className="font-semibold text-gray-800"
                        >
                          Name of the Organization*
                        </FieldLabel>
                        <Input
                          {...field}
                          id="organizationName"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter organization name"
                          autoComplete="off"
                          onChange={(e) =>
                            form.setValue("organizationName", e.target.value)
                          }
                          className="placeholder:text-gray-500 rounded-sm shadow-none border border-gray-300 my-0 py-2"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="slug"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex flex-col gap-1"
                      >
                        <FieldLabel
                          htmlFor="organizationSlug"
                          className="font-semibold text-gray-800"
                        >
                          Organization Slug*
                        </FieldLabel>
                        <Input
                          {...field}
                          id="organizationSlug"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g., my-organization"
                          readOnly
                          className="placeholder:text-gray-500 rounded-sm shadow-none border border-gray-300 my-0 py-2"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
              <div className="w-1/2">
                <FieldGroup>
                  <Field className="flex flex-col gap-1">
                    <FieldLabel>Description(Optional)</FieldLabel>
                    <Textarea
                      {...form.register("description")}
                      placeholder="Provide a brief description of the organization"
                      className="placeholder:text-gray-500 rounded-sm shadow-none border border-gray-300 my-0 py-2"
                    />
                  </Field>
                </FieldGroup>
                <Button
                  variant="default"
                  form="organizationForm"
                  type="submit"
                  className="mt-4"
                >
                  Create Organization
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
