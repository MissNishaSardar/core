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
  InboxIcon,
  PlusIcon,
  Settings2Icon,
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

const homeNav = [
  { title: "Home", url: "/dashboard/home", icon: HomeIcon },
  { title: "Inbox", url: "/dashboard/inbox", icon: BellIcon },
  { title: "My Tasks", url: "/dashboard/my-tasks", icon: ClipboardListIcon },
  { title: "Today", url: "/dashboard/today", icon: CalendarIcon },
  { title: "Upcoming", url: "/dashboard/upcoming", icon: AlarmClockIcon },
];

// ponytail: placeholder data, swap to authClient.useListOrganizations() when Organizations plugin is wired
const workspaces = [
  {
    name: "Personal", slug: "personal", icon: UserIcon,
    pages: [
      { title: "Inbox", slug: "inbox", icon: InboxIcon },
      { title: "Goals", slug: "goals", icon: TargetIcon },
      { title: "Notes", slug: "notes", icon: FileTextIcon },
    ],
    teams: [],
  },
  {
    name: "Acme Inc", slug: "acme-inc", icon: Building2Icon,
    pages: [],
    teams: [
      {
        name: "Engineering", slug: "engineering", icon: Settings2Icon,
        boards: [{ title: "Design System", slug: "design-system" }],
      },
    ],
  },
];

const Sidebar = () => (
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
            WORKSPACES
          </CollapsibleTrigger>
          <SidebarGroupAction render={<Link href="/dashboard/workspaces/new" />} title="New workspace">
            <PlusIcon />
          </SidebarGroupAction>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {workspaces.map((ws) => (
                  <SidebarMenuItem key={ws.slug}>
                    <SidebarMenuButton render={<a href={`/dashboard/${ws.slug}`} />} tooltip={ws.name}>
                      <ws.icon />
                      <span>{ws.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {ws.pages.map((page) => (
                        <SidebarMenuSubItem key={page.slug}>
                          <SidebarMenuSubButton render={<a href={`/dashboard/${ws.slug}/${page.slug}`} />}>
                            <page.icon />
                            <span>{page.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                      {ws.teams.map((team) => (
                        <SidebarMenuSubItem key={team.slug}>
                          <SidebarMenuSubButton render={<a href={`/dashboard/${ws.slug}/${team.slug}`} />}>
                            <team.icon />
                            <span>{team.name}</span>
                          </SidebarMenuSubButton>
                          {team.boards.length > 0 && (
                            <SidebarMenuSub>
                              {team.boards.map((board) => (
                                <SidebarMenuSubItem key={board.slug}>
                                  <SidebarMenuSubButton render={<a href={`/dashboard/${ws.slug}/${team.slug}/${board.slug}`} />}>
                                    <span>{board.title}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          )}
                        </SidebarMenuSubItem>
                      ))}
                      {ws.teams.length > 0 && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton render={<a href={`/dashboard/${ws.slug}/teams/new`} />}>
                            <PlusIcon />
                            <span>New team</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/dashboard/workspaces/new" />} tooltip="New workspace">
                    <PlusIcon />
                    <span>New workspace</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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

export { Sidebar };
