"use client";

import { useRouter } from "next/navigation";
import { Building2Icon, ChevronDownIcon, PlusIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcnui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

const TeamSwitcher = () => {
  const { push } = useRouter();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const handleSelect = async (slug: string) => {
    await authClient.organization.setActive({ organizationSlug: slug });
    push(`/dashboard/${slug}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium outline-hidden hover:bg-muted">
        <Building2Icon size={16} />
        <span>{activeOrg?.name ?? "Personal"}</span>
        <ChevronDownIcon size={14} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        <div className="px-3 py-2.5 text-xs text-muted-foreground">Teams</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => push("/dashboard/home")}>
          <UserIcon size={16} />
          Personal
        </DropdownMenuItem>
        {organizations?.map((org) => (
          <DropdownMenuItem key={org.id} onClick={() => handleSelect(org.slug)}>
            <Building2Icon size={16} />
            {org.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => push("/dashboard/workspaces/new")}>
          <PlusIcon size={16} />
          Create team...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamSwitcher;
