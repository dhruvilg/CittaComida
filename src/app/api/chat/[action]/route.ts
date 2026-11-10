import { NextResponse } from "next/server";
import { allowedPhones, CHAT_COOKIE, cookieOptions, currentUser, makeToken, normalizePhone, ownerPhone } from "@/lib/chat-auth";
import { chatBackend } from "@/lib/chat-backend";
import { notifyOthers } from "@/lib/chat-push";
import { after } from "next/server";

export const dynamic = "force-dynamic";

export type ChatMessage = {
  id: number;
  sender: string;
  body: string | null;
  attachment_url: string | null;
  attachment_type: string | null;
  attachment_name: string | null;
  created_at: string;
};

type Ctx = { params: Promise<{ action: string }> };
const bad = (error: string, status: number) => NextResponse.json({ error }, { status });

// --- login rate limit (per server instance) ---
const attempts = new Map<string, { n: number; t: number }>();

async function login(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const a = attempts.get(ip) || { n: 0, t: Date.now() };
  if (Date.now() - a.t > 15 * 60_000) (a.n = 0), (a.t = Date.now());
  if (a.n >= 8) return bad("Too many attempts. Try later.", 429);

  const { phone, pin } = (await req.json().catch(() => ({}))) as { phone?: string; pin?: string };
  const p = normalizePhone(phone || "");
  const ok = allowedPhones().includes(p) && (pin || "").trim() === (process.env.CHAT_PIN || "").trim();
  if (!ok) {
    a.n += 1;
    attempts.set(ip, a);
    return bad("Not allowed", 401);
  }
  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CHAT_COOKIE, makeToken(p), cookieOptions);
  return res;
}

export async function GET(req: Request, { params }: Ctx) {
  const { action } = await params;
  const me = await currentUser();
  if (!me) return bad("unauthorized", 401);
  if (action === "vapid") return NextResponse.json({ key: process.env.VAPID_PUBLIC_KEY || null });
  if (action !== "messages") return bad("not found", 404);
  const since = Number(new URL(req.url).searchParams.get("after") || 0);
  const r = await chatBackend<{ messages: ChatMessage[]; count: number }>({ action: "list", after: since });
  if (!r.ok) return bad(r.data.error || "backend", 502);
  return NextResponse.json({ me, messages: r.data.messages, count: r.data.count });
}

export async function POST(req: Request, { params }: Ctx) {
  const { action } = await params;
  if (action === "login") return login(req);
  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(CHAT_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  const me = await currentUser();
  if (!me) return bad("unauthorized", 401);

  if (action === "messages") {
    const { body, attachment_path, attachment_type, attachment_name } = (await req.json().catch(() => ({}))) as Record<string, string | undefined>;
    const text = (body || "").trim().slice(0, 4000);
    if (!text && !attachment_path) return bad("empty", 400);
    if (attachment_path && !attachment_path.startsWith(`${me}/`)) return bad("bad attachment", 400);
    const r = await chatBackend<{ id: number }>({ action: "send", sender: me, body: text, attachment_path, attachment_type, attachment_name });
    if (!r.ok) return bad(r.data.error || "backend", 502);
    after(() => notifyOthers(me));
    return NextResponse.json({ ok: true, id: r.data.id });
  }

  if (action === "subscribe") {
    const { sub } = (await req.json().catch(() => ({}))) as { sub?: { endpoint?: string } };
    if (!sub?.endpoint) return bad("bad subscription", 400);
    const r = await chatBackend({ action: "subscribe", sender: me, sub });
    if (!r.ok) return bad(r.data.error || "backend", 502);
    return NextResponse.json({ ok: true });
  }

  if (action === "unsubscribe") {
    const { endpoint } = (await req.json().catch(() => ({}))) as { endpoint?: string };
    if (endpoint) await chatBackend({ action: "unsubscribe", endpoint });
    return NextResponse.json({ ok: true });
  }

  if (action === "upload") {
    const { name } = (await req.json().catch(() => ({}))) as { name?: string };
    const r = await chatBackend<{ path: string; signedUrl: string }>({ action: "upload", sender: me, name });
    if (!r.ok) return bad(r.data.error || "backend", 502);
    return NextResponse.json({ path: r.data.path, signedUrl: r.data.signedUrl });
  }

  return bad("not found", 404);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { action } = await params;
  if (action !== "clear") return bad("not found", 404);
  const me = await currentUser();
  if (!me) return bad("unauthorized", 401);
  if (me !== ownerPhone()) return bad("only the owner can clear", 403);
  const r = await chatBackend<{ removed: number }>({ action: "clear" });
  if (!r.ok) return bad(r.data.error || "backend", 502);
  return NextResponse.json({ ok: true, removed: r.data.removed });
}
