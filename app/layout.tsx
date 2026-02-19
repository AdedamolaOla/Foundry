import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { isAdminUser } from "@/lib/admin";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design in a Box",
  description: "Community-driven design resource library",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showAdminLink = await isAdminUser();
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <AppShell showAdminLink={showAdminLink}>{children}</AppShell>
      </body>
    </html>
  );
}
