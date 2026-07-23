import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Core",
  description: "Core application",
};

const RootPage = () => {
  redirect("/auth/login");
};

export default RootPage;
