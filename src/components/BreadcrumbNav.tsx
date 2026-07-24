"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/shadcnui/button";

const backLinks: Record<string, { href: string; label: string }> = {
  "/dashboard/profile": { href: "/dashboard/home", label: "Back to Dashboard" },
  "/dashboard/profile/edit": { href: "/dashboard/profile", label: "Back to Profile" },
};

const BreadcrumbNav = () => {
  const pathname = usePathname();

  const exact = backLinks[pathname];
  if (exact) {
    return (
      // @ts-expect-error - typedRoutes expects route literals, but values are dynamic
      <Link href={exact.href}>
        <Button
          variant="ghost"
          className="gap-1">
          <ArrowLeftIcon className="size-4" />
          {exact.label}
        </Button>
      </Link>
    );
  }

  return null;
};

export default BreadcrumbNav;
