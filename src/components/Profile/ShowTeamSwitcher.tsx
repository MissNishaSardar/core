"use client";

import { usePathname } from "next/navigation";
import TeamSwitcher from "@/components/Profile/TeamSwitcher";

const hideOn = ["/dashboard/profile", "/dashboard/settings"];

const ShowTeamSwitcher = () => {
  const pathname = usePathname();
  if (hideOn.some((p) => pathname.startsWith(p))) return null;
  return <TeamSwitcher />;
};

export { ShowTeamSwitcher };
