import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminPage() {
  const ok = await isAdminUser();
  if (!ok) {
    redirect("/admin/login");
  }
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from("contributions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  const { data: rejected } = await supabase
    .from("contributions")
    .select("*")
    .eq("status", "rejected")
    .order("created_at", { ascending: false });
  return (
    <AdminDashboard
      pending={pending ?? []}
      rejected={rejected ?? []}
    />
  );
}
