"use client";

import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shadcnui/card";
import { LoaderCircle } from "lucide-react";

const AcceptInvitation = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useRouter();
  const [status, setStatus] = useState<"accepting" | "done" | "error">("accepting");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const accept = async () => {
      const { error } = await authClient.organization.acceptInvitation({
        invitationId: id,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message ?? "Failed to accept invitation");
      } else {
        setStatus("done");
        setMessage("You've joined the team!");
        setTimeout(() => push("/dashboard"), 1500);
      }
    };

    accept();
  }, [id, push]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>
            {status === "accepting" && "Accepting Invitation..."}
            {status === "done" && "Welcome!"}
            {status === "error" && "Invitation Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          {status === "accepting" && <LoaderCircle className="size-8 animate-spin text-muted-foreground" />}
        </CardContent>
      </Card>
    </div>
  );
};

export { AcceptInvitation };
