"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTeamSchema, type UpdateTeamType } from "@/lib/zodSchema";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/shadcnui/button";
import { Field, FieldLabel, FieldError } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/shadcnui/card";
import { LoaderCircle, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/shadcnui/alert-dialog";

const TeamSettings = ({ slug }: { slug: string }) => {
  const { push } = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const init = async () => {
      const { data: org, error } = await authClient.organization.getFullOrganization({
        query: { organizationSlug: slug },
      });
      if (error || !org) return;
      setOrgId(org.id as string);
      setOrgName(org.name as string);
      reset({ name: org.name as string });
      if (!session?.user.id) return;
      const members = (org as Record<string, unknown>).members as Array<{ userId: string; role: string }> | undefined;
      const me = members?.find((m) => m.userId === session.user.id);
      if (me?.role === "owner") setIsOwner(true);
    };
    init();
  }, [slug, session?.user.id]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateTeamType>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: { name: "" },
    mode: "all",
  });

  const onRename = async (data: UpdateTeamType) => {
    const { error } = await authClient.organization.update({
      data: { name: data.name },
    });

    if (error) {
      toast.error(error.message ?? "Failed to rename team");
    } else {
      toast.success("Team renamed");
    }
  };

  const handleDelete = async () => {
    if (!orgId) return;
    setDeleting(true);
    const { error } = await authClient.organization.delete({
      organizationId: orgId,
    });

    setDeleting(false);
    if (error) {
      toast.error(error.message ?? "Failed to delete team");
    } else {
      toast.success("Team deleted");
      push("/dashboard");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Team Name</CardTitle>
          <CardDescription>Change your team&apos;s display name.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onRename)} noValidate>
          <CardContent>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
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
          <CardFooter className="justify-end gap-2 pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="animate-spin" />}
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Delete Team</CardTitle>
            <CardDescription>
              Permanently delete this team and all its data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">
                  <Trash2Icon />
                  Delete Team
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Team</AlertDialogTitle>
                  <AlertDialogDescription>
                    Permanently delete this team and all its data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                    {deleting && <LoaderCircle className="animate-spin" />}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export { TeamSettings };
