"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTeamSchema, type CreateTeamType } from "@/lib/zodSchema";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/shadcnui/button";
import { Field, FieldLabel, FieldError } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/shadcnui/card";
import { LoaderCircle } from "lucide-react";

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const CreateTeamForm = () => {
  const { push } = useRouter();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateTeamType>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: "" },
    mode: "all",
  });

  const onSubmit = async (data: CreateTeamType) => {
    try {
      const slug = slugify(data.name);
      const { error } = await authClient.organization.create({
        name: data.name,
        slug,
      });

      if (error) {
        toast.error(error.message ?? "Failed to create team");
      } else {
        const { error: activeError } = await authClient.organization.setActive({ organizationSlug: slug });
        if (activeError) toast.error(activeError.message ?? "Failed to set active team");
        push(`/dashboard/${slug}`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create team");
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-md">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardHeader>
            <CardTitle>Create Team</CardTitle>
            <CardDescription>Set up a new team for your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Team Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </CardContent>
          <CardFooter className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <LoaderCircle className="animate-spin" />}
              Create Team
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export { CreateTeamForm };
