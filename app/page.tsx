import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contributions")
    .select("*")
    .order("created_at", { ascending: false });
  const resources = data ?? [];
  return <HomeClient initialResources={resources} />;
}
