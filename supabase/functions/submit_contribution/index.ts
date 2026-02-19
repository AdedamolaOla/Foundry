import "jsr:@supabase/functions-js/edge_runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ATTRIBUTION_TYPES = ["anonymous", "x", "instagram", "linkedin", "github"] as const;
const MAX_TITLE = 300;
const MAX_LINK = 2048;
const MAX_DESCRIPTION = 2000;
const MAX_CATEGORY = 100;
const MAX_ATTRIBUTION_VALUE = 500;

interface SubmitBody {
  title: string;
  link: string;
  description?: string | null;
  category: string;
  attribution_type: (typeof ATTRIBUTION_TYPES)[number];
  attribution_value?: string | null;
}

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors() });
  }
  try {
    const body = (await req.json()) as SubmitBody;
    const { title, link, description, category, attribution_type, attribution_value } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return json({ error: "title is required" }, 400);
    }
    if (title.length > MAX_TITLE) {
      return json({ error: "title too long" }, 400);
    }
    if (!link || typeof link !== "string" || !isValidUrl(link.trim())) {
      return json({ error: "valid link URL is required" }, 400);
    }
    if (link.length > MAX_LINK) {
      return json({ error: "link too long" }, 400);
    }
    if (!category || typeof category !== "string" || category.trim().length === 0) {
      return json({ error: "category is required" }, 400);
    }
    if (category.length > MAX_CATEGORY) {
      return json({ error: "category too long" }, 400);
    }
    if (!ATTRIBUTION_TYPES.includes(attribution_type)) {
      return json({ error: "invalid attribution_type" }, 400);
    }
    if (attribution_type !== "anonymous") {
      const val = attribution_value == null ? "" : String(attribution_value).trim();
      if (val.length === 0) {
        return json({ error: "attribution_value required when not anonymous" }, 400);
      }
      if (val.length > MAX_ATTRIBUTION_VALUE) {
        return json({ error: "attribution_value too long" }, 400);
      }
    }
    const desc =
      description != null && description !== ""
        ? String(description).trim().slice(0, MAX_DESCRIPTION)
        : null;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const row = {
      title: title.trim(),
      link: link.trim(),
      description: desc,
      category: category.trim(),
      attribution_type,
      attribution_value:
        attribution_type === "anonymous"
          ? null
          : (attribution_value == null ? "" : String(attribution_value).trim()).slice(0, MAX_ATTRIBUTION_VALUE) || null,
      preview_image_url: null,
      status: "pending",
    };

    const { error } = await supabase.from("contributions").insert(row);
    if (error) {
      console.error(error);
      return json({ error: "Failed to save contribution" }, 500);
    }
    return json({ success: true, message: "pending confirmation" }, 200);
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
