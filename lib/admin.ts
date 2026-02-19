import { createClient } from "@/lib/supabase/server";

/**
 * Returns true if the current user is an admin (in admin_users table).
 * Use in server components / server actions for /admin routes.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  return !!data;
}

/**
 * Optional: allowlist from env (comma-separated emails).
 * If ADMIN_EMAILS is set, treat those users as admin even without admin_users row.
 */
export function getAdminEmailsFromEnv(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw || typeof raw !== "string") return [];
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export async function isAdminByEmail(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return false;
  const allowlist = getAdminEmailsFromEnv();
  return allowlist.includes(user.email.toLowerCase());
}

/** User is admin if in admin_users OR in ADMIN_EMAILS env. */
export async function isAdminUser(): Promise<boolean> {
  const [byTable, byEmail] = await Promise.all([isAdmin(), isAdminByEmail()]);
  return byTable || byEmail;
}
