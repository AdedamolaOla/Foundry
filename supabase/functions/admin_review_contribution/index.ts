import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Action = "approve" | "reject" | "edit";

interface ReviewBody {
  contribution_id: string;
  action: Action;
  title?: string;
  link?: string;
  description?: string | null;
  category?: string;
  attribution_type?: string;
  attribution_value?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors() });
  }
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }
  const token = authHeader.slice(7);
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error: userError } = await supabaseUser.auth.getUser(token);
  if (userError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  const { data: adminRow } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) {
    return json({ error: "Forbidden: admin only" }, 403);
  }

  try {
    const body = (await req.json()) as ReviewBody;
    const { contribution_id, action } = body;
    if (!contribution_id || typeof contribution_id !== "string") {
      return json({ error: "contribution_id required" }, 400);
    }
    if (!["approve", "reject", "edit"].includes(action)) {
      return json({ error: "action must be approve, reject, or edit" }, 400);
    }

    if (action === "approve") {
      const { error } = await supabaseAdmin
        .from("contributions")
        .update({ status: "approved" })
        .eq("id", contribution_id);
      if (error) {
        console.error(error);
        return json({ error: "Update failed" }, 500);
      }
      return json({ success: true }, 200);
    }

    if (action === "reject") {
      const { error } = await supabaseAdmin
        .from("contributions")
        .update({ status: "rejected" })
        .eq("id", contribution_id);
      if (error) {
        console.error(error);
        return json({ error: "Update failed" }, 500);
      }
      return json({ success: true }, 200);
    }

    // edit
    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.link !== undefined) updates.link = String(body.link).trim();
    if (body.description !== undefined) updates.description = body.description == null ? null : String(body.description).trim();
    if (body.category !== undefined) updates.category = String(body.category).trim();
    if (body.attribution_type !== undefined) updates.attribution_type = body.attribution_type;
    if (body.attribution_value !== undefined) updates.attribution_value = body.attribution_value == null ? null : String(body.attribution_value).trim();
    if (Object.keys(updates).length === 0) {
      return json({ error: "No fields to update" }, 400);
    }
    const { error } = await supabaseAdmin
      .from("contributions")
      .update(updates)
      .eq("id", contribution_id);
    if (error) {
      console.error(error);
      return json({ error: "Update failed" }, 500);
    }
    return json({ success: true }, 200);
  } catch (e) {
    console.error(e);
    return json({ error: "Invalid request" }, 400);
  }
});

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}
function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors() },
  });
}
