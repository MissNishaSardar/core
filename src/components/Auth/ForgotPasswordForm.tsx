"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema, type
  ForgotPasswordType } from
  "@/lib/zodSchema";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Button } from "@/components/shadcnui/button";
import { Field, FieldLabel, FieldError } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { LoaderCircle } from "lucide-react";

const ForgotPasswordForm = () => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "all",
  });

  const onSubmit = async (data: ForgotPasswordType) => {
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/auth/reset-password",
    });

    if (error) {
      toast.error(error.message ?? "Something went wrong");
    } else {
      toast.success("Check your email for a reset link");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              autoComplete="email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={isSubmitting} className="mt-4 w-full">
        {isSubmitting && <LoaderCircle className="animate-spin" />}
        Send reset link
      </Button>
    </form>
  );
};

export { ForgotPasswordForm };
