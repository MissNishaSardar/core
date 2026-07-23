"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema, type
  ResetPasswordType } from
  "@/lib/zodSchema";
import { authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/shadcnui/button";
import { Field, FieldLabel, FieldError } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { LoaderCircle } from "lucide-react";

const ResetPasswordForm = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "all",
  });

  const onSubmit = async (data: ResetPasswordType) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    if (error) {
      toast.error(error.message ?? "Something went wrong");
    } else {
      toast.success("Password reset successfully");
      push("/auth/login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>New password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
              autoComplete="new-password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="password"
              autoComplete="new-password"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={isSubmitting || !token} className="mt-4 w-full">
        {isSubmitting && <LoaderCircle className="animate-spin" />}
        Reset password
      </Button>
    </form>
  );
};

export { ResetPasswordForm };
