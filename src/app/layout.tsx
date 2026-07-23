import type { Metadata } from "next";
import { notoSansHeading, nunitoSans } from "@/lib/fonts";
import { TooltipProvider } from "@/components/shadcnui/tooltip";
import ThemeProvider from "@/components/Providers/ThemeProvider";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Core",
  description: "Core application",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={`${notoSansHeading.variable} ${nunitoSans.variable} font-sans antialiased`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
