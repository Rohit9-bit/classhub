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
import {
  BadgeCheck,
  Building2,
  CirclePlus,
  LayoutGrid,
  List,
  Sparkles,
  Users,
} from "lucide-react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
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

  const [organizations, setOrganizations] = React.useState<Object[]>([]);
  async function fetchOrganizations() {
    try {
      const response = await axios.get("/api/organizations");
      if (response.data.success) {
        setOrganizations(response.data.data.organizations);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data.error || "Failed to fetch organizations",
      );
    }
  }

  React.useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Workspace spaces
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Organizations
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage your institutional spaces and academic collaborations.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-border/60 bg-card/95 shadow-lg shadow-slate-950/5">
        <CardHeader className="border-b border-border/60 bg-linear-to-r from-slate-50 to-white/40 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Create a New Organization
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Establish a new hub for your department, school, or study
                  group. Fill in the details below to get started.
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-3 py-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                Verified spaces
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-3 py-1.5">
                <Users className="h-3.5 w-3.5 text-sky-500" />
                Shared access
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form id="organizationForm" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-6">
                <FieldGroup className="gap-6">
                  <Controller
                    name="organizationName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="space-y-2"
                      >
                        <FieldLabel
                          htmlFor="organizationName"
                          className="text-sm font-medium text-foreground"
                        >
                          Organization Name
                          <span className="ml-1 text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="organizationName"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. Stanford CS Faculty"
                          autoComplete="off"
                          onChange={(e) =>
                            form.setValue("organizationName", e.target.value)
                          }
                          className="h-11 rounded-xl border-border/70 bg-background/80 px-4 text-sm shadow-none placeholder:text-muted-foreground/70"
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
                        className="space-y-2"
                      >
                        <FieldLabel
                          htmlFor="organizationSlug"
                          className="text-sm font-medium text-foreground"
                        >
                          Organization Slug
                          <span className="ml-1 text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup className="h-11 overflow-hidden rounded-xl border-border/70 bg-background/80 shadow-none">
                          <InputGroupAddon className="border-r border-border/70 bg-muted/60 px-3 text-sm text-muted-foreground">
                            classhub.ai/org/
                          </InputGroupAddon>
                          <InputGroupInput
                            {...field}
                            id="organizationSlug"
                            aria-invalid={fieldState.invalid}
                            placeholder="stanford-cs"
                            readOnly
                            className="px-4 text-sm"
                          />
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>

              <div className="space-y-6">
                <FieldGroup className="gap-6">
                  <Field className="space-y-2">
                    <FieldLabel
                      htmlFor="organizationDescription"
                      className="text-sm font-medium text-foreground"
                    >
                      Description{" "}
                      <span className="text-muted-foreground">(Optional)</span>
                    </FieldLabel>
                    <Textarea
                      {...form.register("description")}
                      id="organizationDescription"
                      placeholder="Describe the purpose of this organization..."
                      className="min-h-36 rounded-2xl border-border/70 bg-background/80 px-4 py-3 text-sm shadow-none placeholder:text-muted-foreground/70"
                    />
                  </Field>
                </FieldGroup>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <div className="text-xs text-muted-foreground sm:mr-auto">
                    Set up a space for your team, department, or study group.
                  </div>
                  <Button
                    variant="default"
                    form="organizationForm"
                    type="submit"
                    className="h-11 rounded-xl px-6 shadow-lg shadow-primary/20"
                  >
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Create Organization
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Your Organizations
            </h2>
            <p className="text-sm text-muted-foreground">
              Spaces you already manage and collaborate in.
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button variant="ghost" size="icon-sm" className="rounded-lg">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="rounded-lg">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {organizations.length === 0 ? (
            <Card className="border-dashed border-border/70 bg-background/70 shadow-none">
              <CardContent className="flex min-h-53.5 flex-col items-center justify-center gap-3 p-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">
                    No Organizations Found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You are not a member of any organizations yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            organizations.map((organization: any, index: number) => {
              return (
                <Card
                  className="border-border/60 bg-card/95 shadow-sm"
                  key={index}
                >
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 ring-1 ring-violet-200/80 dark:bg-violet-500/10 dark:text-violet-300">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-base font-semibold text-foreground">
                            {organization.name}
                          </div>
                          <div className="truncate text-sm text-muted-foreground">
                            {organization.description}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 p-4 text-center">
                          <div className="text-2xl font-semibold text-primary">
                            1,240
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Members
                          </div>
                        </div>
                        <div className="rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 p-4 text-center">
                          <div className="text-2xl font-semibold text-primary">
                            42
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Subjects
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <AvatarGroup>
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/maxleiter.png"
                              alt="@maxleiter"
                            />
                            <AvatarFallback>LR</AvatarFallback>
                          </Avatar>
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/evilrabbit.png"
                              alt="@evilrabbit"
                            />
                            <AvatarFallback>ER</AvatarFallback>
                          </Avatar>
                          <AvatarGroupCount>+3</AvatarGroupCount>
                        </AvatarGroup>
                        <Button variant="link">
                          Manage Members <ChevronRight />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}

          <Card className="border-border/60 bg-card/95 shadow-sm">
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 ring-1 ring-sky-200/80 dark:bg-sky-500/10 dark:text-sky-300">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-foreground">
                      Stanford University
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      Computer Science
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 p-4 text-center">
                    <div className="text-2xl font-semibold text-primary">
                      856
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Members
                    </div>
                  </div>
                  <div className="rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 p-4 text-center">
                    <div className="text-2xl font-semibold text-primary">
                      15
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Subjects
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <AvatarGroup>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/maxleiter.png"
                        alt="@maxleiter"
                      />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/evilrabbit.png"
                        alt="@evilrabbit"
                      />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount>+3</AvatarGroupCount>
                  </AvatarGroup>
                  <Button variant="link">
                    Manage Members <ChevronRight />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed border-border/70 bg-background/70 shadow-none">
            <CardContent className="flex min-h-53.5 flex-col items-center justify-center gap-3 p-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-muted-foreground">
                <CirclePlus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Add New Space
                </p>
                <p className="mt-1 max-w-44 text-sm leading-6 text-muted-foreground">
                  Create a new environment for your team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default page;
