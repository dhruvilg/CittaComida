/** Calls the Supabase Edge Function that owns the notes-room data. */
export async function chatBackend<T = unknown>(payload: Record<string, unknown>): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.CHAT_EDGE_KEY;
  if (!url || !key) return { ok: false, status: 500, data: { error: "backend not configured" } as T & { error?: string } };
  const r = await fetch(`${url}/functions/v1/cc-chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-chat-key": key },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await r.json().catch(() => ({}))) as T & { error?: string };
  return { ok: r.ok, status: r.status, data };
}
