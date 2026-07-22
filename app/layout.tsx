import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { isAdminUser } from "@/lib/admin";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showAdminLink = await isAdminUser();
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <AppShell showAdminLink={showAdminLink}>{children}</AppShell>
      </body>
    </html>
  );
}
