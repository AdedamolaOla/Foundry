import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppShell } from "@/components/AppShell";
import { isAdminUser } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Foundry",
  description: "Community-driven design resource library",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showAdminLink = await isAdminUser();
  const supabase = await createClient();
  const { count } = await supabase
    .from("contributions")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <AppShell showAdminLink={showAdminLink} resourceCount={count ?? 0}>
          {children}
        </AppShell>
        <Analytics />
      </body>
    </html>
  );
}
