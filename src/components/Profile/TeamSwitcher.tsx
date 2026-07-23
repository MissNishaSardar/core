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

// ponytail: placeholder workspaces, swap to authClient.useListOrganizations() when Organizations plugin is wired
const workspaces = [
  { name: "Personal", slug: "personal", icon: UserIcon },
  { name: "Acme Inc", slug: "acme-inc", icon: Building2Icon },
];

const TeamSwitcher = () => {
  const { push } = useRouter();
  const activeWorkspace = workspaces[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium outline-hidden hover:bg-muted">
        {activeWorkspace.icon && <activeWorkspace.icon size={16} />}
        <span>{activeWorkspace.name}</span>
        <ChevronDownIcon size={14} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        <div className="px-3 py-2.5 text-xs text-muted-foreground">Workspaces</div>
        <DropdownMenuSeparator />
        {workspaces.map((ws) => (
          <DropdownMenuItem key={ws.slug} onClick={() => push(`/dashboard/${ws.slug}`)}>
            <ws.icon size={16} />
            {ws.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => push("/dashboard/workspaces/new")}>
          <PlusIcon size={16} />
          Create workspace...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamSwitcher;
