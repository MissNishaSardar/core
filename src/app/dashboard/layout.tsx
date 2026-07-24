import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShowTeamSwitcher } from "@/components/Profile/ShowTeamSwitcher";
import UserMenu from "@/components/Profile/UserMenu";
import ThemeToggleButton from "@/components/Buttons/ThemeToggleButton";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/shadcnui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcnui/sidebar";

type DashboardLayoutProps = Readonly<{
  children: ReactNode;
}>;

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { name, email, image } = session.user;

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <BreadcrumbNav />
          <ShowTeamSwitcher />
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggleButton />
            <UserMenu name={name ?? "User"} email={email ?? ""} avatarSrc={image} />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
