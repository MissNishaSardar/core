"use client";

import Link from "next/link";
import {
  AlarmClockIcon,
  BellIcon,
  Building2Icon,
  CalendarIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  FileTextIcon,
  HexagonIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
  TargetIcon,
  UserIcon,
} from "lucide-react";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/shadcnui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcnui/collapsible";
import { authClient } from "@/lib/auth-client";

const homeNav = [
  { title: "Home", url: "/dashboard/home", icon: HomeIcon },
  { title: "Inbox", url: "/dashboard/inbox", icon: BellIcon },
  { title: "My Tasks", url: "/dashboard/my-tasks", icon: ClipboardListIcon },
  { title: "Today", url: "/dashboard/today", icon: CalendarIcon },
  { title: "Upcoming", url: "/dashboard/upcoming", icon: AlarmClockIcon },
];

const personalPages = [
  { title: "Goals", slug: "goals", icon: TargetIcon },
  { title: "Notes", slug: "notes", icon: FileTextIcon },
];

const sidebarNav = (org: { id: string; name: string; slug: string }) => [
  { title: "Projects", url: `/dashboard/${org.slug}` },
  { title: "Members", url: `/dashboard/${org.slug}/members` },
  { title: "Settings", url: `/dashboard/${org.slug}/settings` },
];

const Sidebar = () => {
  const { data: organizations } = authClient.useListOrganizations();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard/home" />} tooltip="Core">
              <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <HexagonIcon className="size-4" />
              </div>
              <span className="font-semibold">Core</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>HOME</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href={item.url} />} tooltip={item.title}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <CollapsibleTrigger render={<SidebarGroupLabel />} nativeButton={false}>
              <ChevronRightIcon className="transition-transform group-data-[open]/collapsible:rotate-90" />
              TEAMS
            </CollapsibleTrigger>
            <SidebarGroupAction render={<Link href="/dashboard/workspaces/new" />} title="New team">
              <PlusIcon />
            </SidebarGroupAction>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<Link href="/dashboard/home" />} tooltip="Personal">
                      <UserIcon />
                      <span>Personal</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {personalPages.map((page) => (
                        <SidebarMenuSubItem key={page.slug}>
                          <SidebarMenuSubButton render={<a href={`/dashboard/${page.slug}`} />}>
                            <page.icon />
                            <span>{page.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>

                  {organizations?.map((org) => (
                    <SidebarMenuItem key={org.id}>
                      <SidebarMenuButton render={<a href={`/dashboard/${org.slug}`} />} tooltip={org.name}>
                        <Building2Icon />
                        <span>{org.name}</span>
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {sidebarNav(org).map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton render={<a href={item.url} />}>
                              <span>{item.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/dashboard/profile" />} tooltip="Profile">
                  <UserIcon />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/dashboard/settings" />} tooltip="Settings">
                  <SettingsIcon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </SidebarPrimitive>
  );
};

export { Sidebar };
