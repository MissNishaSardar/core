"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, type CreateProjectType } from "@/lib/zodSchema";
import { createProject } from "@/server/projects";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/shadcnui/field";
import { Loader2Icon } from "lucide-react";
import { toast } from "react-toastify";

type CreateProjectFormProps = {
  slug: string;
};

const CreateProjectForm = ({ slug }: CreateProjectFormProps) => {
  const { push } = useRouter();
  const { handleSubmit, control, formState: { isSubmitting } } = useForm<CreateProjectType>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = async (data: CreateProjectType) => {
    const result = await createProject(slug, data.name, data.description || undefined);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Project created");
      push(`/dashboard/${slug}/projects/${result.project!.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md">
      <Controller name="name" control={control} render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Project Name</FieldLabel>
          <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="off" />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )} />
      <Controller name="description" control={control} render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>Description (optional)</FieldLabel>
          <Textarea {...field} id={field.name} rows={3} />
        </Field>
      )} />
      <Button type="submit" disabled={isSubmitting} className="mt-4">
        {isSubmitting && <Loader2Icon className="animate-spin" />}
        Create Project
      </Button>
    </form>
  );
};

export default CreateProjectForm;
