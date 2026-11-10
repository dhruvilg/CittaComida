// Private notes room backend. Runs inside Supabase, so it has the service-role key
// without that key ever leaving Supabase. Callers must present the shared key.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "cc-chat";
const TABLE = "cc_chat_messages";
const SHARED_KEY = Deno.env.get("CHAT_EDGE_KEY") ?? "";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (req.headers.get("x-chat-key") !== SHARED_KEY) return json({ error: "forbidden" }, 403);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const p = (await req.json().catch(() => ({}))) as Record<string, any>;

  switch (p.action) {
    case "list": {
      const after = Number(p.after || 0);
      let q = sb.from(TABLE).select("*").order("id", { ascending: true });
      q = after > 0 ? q.gt("id", after) : q.limit(300);
      const { data, error } = await q;
      if (error) return json({ error: error.message }, 500);
      const paths = data.filter((m) => m.attachment_path).map((m) => m.attachment_path as string);
      const urls = new Map<string, string>();
      if (paths.length) {
        const { data: signed } = await sb.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 6);
        signed?.forEach((s) => s.path && s.signedUrl && urls.set(s.path, s.signedUrl));
      }
      return json({
        messages: data.map((m) => ({
          id: m.id,
          sender: m.sender,
          body: m.body,
          attachment_url: m.attachment_path ? urls.get(m.attachment_path) || null : null,
          attachment_type: m.attachment_type,
          attachment_name: m.attachment_name,
          created_at: m.created_at,
        })),
      });
    }
    case "send": {
      const text = String(p.body || "").trim().slice(0, 4000);
      if (!text && !p.attachment_path) return json({ error: "empty" }, 400);
      if (!p.sender) return json({ error: "sender" }, 400);
      if (p.attachment_path && !String(p.attachment_path).startsWith(p.sender + "/")) return json({ error: "bad attachment" }, 400);
      const { data, error } = await sb
        .from(TABLE)
        .insert({
          sender: p.sender,
          body: text || null,
          attachment_path: p.attachment_path || null,
          attachment_type: p.attachment_type || null,
          attachment_name: p.attachment_name || null,
        })
        .select("id")
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, id: data.id });
    }
    case "upload": {
      const safe = String(p.name || "file").replace(/[^\w.\-]+/g, "_").slice(-80);
      const path = `${p.sender}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
      const { data, error } = await sb.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error || !data) return json({ error: error?.message || "upload" }, 500);
      return json({ path, signedUrl: data.signedUrl });
    }
    case "clear": {
      const { data: rows } = await sb.from(TABLE).select("attachment_path").not("attachment_path", "is", null);
      const paths = (rows || []).map((r) => r.attachment_path as string);
      if (paths.length) await sb.storage.from(BUCKET).remove(paths);
      const { error } = await sb.from(TABLE).delete().gt("id", 0);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, removed: paths.length });
    }
    default:
      return json({ error: "unknown action" }, 400);
  }
});
