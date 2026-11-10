"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Hibiscus from "@/components/Hibiscus";
import type { ChatMessage } from "@/app/api/chat/[action]/route";

const POLL_MS = 2000;
const urlRe = /(https?:\/\/[^\s<]+)/g;

type LocalMessage = ChatMessage & { pending?: boolean; failed?: boolean };

function Linkify({ text }: { text: string }) {
  const parts = text.split(urlRe);
  return (
    <>
      {parts.map((p, i) =>
        urlRe.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noreferrer" className="underline decoration-current/50 underline-offset-2 break-all">
            {p}
          </a>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

function Attachment({ m }: { m: ChatMessage }) {
  if (!m.attachment_url) return null;
  const t = m.attachment_type || "";
  if (t.startsWith("image/"))
    return (
      <a href={m.attachment_url} target="_blank" rel="noreferrer">
        <img src={m.attachment_url} alt={m.attachment_name || "image"} className="max-h-[60vh] w-full rounded-2xl object-cover" />
      </a>
    );
  if (t.startsWith("video/"))
    return <video src={m.attachment_url} controls playsInline preload="metadata" className="max-h-[60vh] w-full rounded-2xl bg-black" />;
  if (t.startsWith("audio/")) return <audio src={m.attachment_url} controls className="w-full" />;
  return (
    <a href={m.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl bg-black/10 px-3 py-2 text-sm underline">
      📎 {m.attachment_name || "file"}
    </a>
  );
}

const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
const fmtDay = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
};

const b64ToU8 = (b64: string) => {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

export default function ChatRoom({ me, isOwner }: { me: string; isOwner: boolean }) {
  const router = useRouter();
  const [msgs, setMsgs] = useState<LocalMessage[]>([]);
  const [text, setText] = useState("");
  const [upload, setUpload] = useState<{ name: string; pct: number } | null>(null);
  const [online, setOnline] = useState(true);
  const [notif, setNotif] = useState<"unsupported" | "off" | "on" | "denied">("off");
  const [unread, setUnread] = useState(0);
  const lastId = useRef(0);
  const count = useRef(0);
  const inflight = useRef(false);
  const bottom = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const stuckToBottom = useRef(true);
  const tempId = useRef(-1);

  const scrollToBottom = (smooth = true) => bottom.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });

  /** Fetch newer messages; if the server count shrank (cleared), reload fully. */
  const sync = useCallback(
    async (fullRequested = false) => {
      if (inflight.current) return;
      inflight.current = true;
      let full = fullRequested;
      try {
        const since = full ? 0 : lastId.current;
        const r = await fetch(`/api/chat/messages?after=${since}`, { cache: "no-store" });
        if (r.status === 401) return router.refresh();
        if (!r.ok) throw new Error();
        const data = (await r.json()) as { messages: ChatMessage[]; count: number };
        setOnline(true);

        let serverCount = data.count ?? 0;
        let messages = data.messages;
        if (!full && serverCount < count.current) {
          // remote clear → reload everything once
          const r2 = await fetch(`/api/chat/messages?after=0`, { cache: "no-store" });
          if (!r2.ok) throw new Error();
          const d2 = (await r2.json()) as { messages: ChatMessage[]; count: number };
          serverCount = d2.count ?? 0;
          messages = d2.messages;
          full = true;
        }
        count.current = serverCount;

        if (full) {
          setMsgs(messages);
          lastId.current = messages.at(-1)?.id || 0;
          setTimeout(() => scrollToBottom(false), 30);
        } else if (data.messages.length) {
          lastId.current = data.messages.at(-1)!.id;
          setMsgs((prev) => {
            const confirmed = prev.filter((m) => !m.pending);
            const fresh = data.messages.filter((m) => !confirmed.some((c) => c.id === m.id));
            // drop optimistic copies that the server has now echoed back
            const stillPending = prev.filter((m) => m.pending && !fresh.some((f) => f.sender === me && f.body === m.body && f.attachment_name === m.attachment_name));
            const merged: LocalMessage[] = [...confirmed, ...fresh, ...stillPending];
            return merged.sort((a, b) => (a.pending ? 1 : b.pending ? -1 : a.id - b.id));
          });
          const incoming = data.messages.filter((m) => m.sender !== me).length;
          if (incoming && document.visibilityState !== "visible") setUnread((u) => u + incoming);
          if (stuckToBottom.current) setTimeout(() => scrollToBottom(), 40);
        }
      } catch {
        setOnline(false);
      } finally {
        inflight.current = false;
      }
    },
    [router, me]
  );

  useEffect(() => {
    const t = setTimeout(() => sync(true), 0);
    const id = setInterval(() => document.visibilityState === "visible" && sync(), POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") {
        setUnread(0);
        sync();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onVis);
    return () => {
      clearTimeout(t);
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onVis);
    };
  }, [sync]);

  // bland tab title; count only while hidden
  useEffect(() => {
    document.title = unread ? `(${unread}) Citta Comida` : "Citta Comida";
  }, [unread]);

  // notifications: register SW + reflect current state
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setTimeout(() => setNotif("unsupported"), 0);
      return;
    }
    navigator.serviceWorker.register("/sw.js").then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      if (Notification.permission === "denied") setNotif("denied");
      else setNotif(sub ? "on" : "off");
    });
  }, []);

  const toggleNotif = async () => {
    if (notif === "unsupported" || notif === "denied") {
      alert(notif === "denied" ? "Notifications are blocked for this site in your browser settings." : "This browser can't do notifications. On iPhone, add the site to your Home Screen first.");
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    if (notif === "on") {
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/chat/unsubscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
        await sub.unsubscribe();
      }
      setNotif("off");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      setNotif(perm === "denied" ? "denied" : "off");
      return;
    }
    const { key } = (await fetch("/api/chat/vapid").then((r) => r.json())) as { key: string | null };
    if (!key) return alert("Notifications aren't configured yet.");
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(key) });
    const r = await fetch("/api/chat/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sub: sub.toJSON() }) });
    setNotif(r.ok ? "on" : "off");
  };

  const onScroll = () => {
    const el = list.current;
    if (!el) return;
    stuckToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  /** Optimistic send: show instantly, confirm in background. */
  const send = async (payload: { body?: string; attachment_path?: string; attachment_type?: string; attachment_name?: string; attachment_url?: string }) => {
    const id = tempId.current--;
    const optimistic: LocalMessage = {
      id,
      sender: me,
      body: payload.body || null,
      attachment_url: payload.attachment_url || null,
      attachment_type: payload.attachment_type || null,
      attachment_name: payload.attachment_name || null,
      created_at: new Date().toISOString(),
      pending: true,
    };
    setMsgs((prev) => [...prev, optimistic]);
    stuckToBottom.current = true;
    setTimeout(() => scrollToBottom(), 20);
    const r = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: payload.body, attachment_path: payload.attachment_path, attachment_type: payload.attachment_type, attachment_name: payload.attachment_name }),
    });
    if (!r.ok) {
      setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, pending: false, failed: true } : m)));
      return;
    }
    await sync();
    // if the echo didn't match (e.g. identical text sent twice), drop the optimistic copy anyway
    setMsgs((prev) => prev.filter((m) => m.id !== id));
  };

  const sendText = () => {
    const body = text.trim();
    if (!body) return;
    setText("");
    void send({ body });
  };

  const sendFiles = async (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name} is over 50 MB`);
        continue;
      }
      setUpload({ name: file.name, pct: 0 });
      const r = await fetch("/api/chat/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: file.name, type: file.type }),
      });
      if (!r.ok) {
        setUpload(null);
        alert("Upload failed");
        continue;
      }
      const { path, signedUrl } = (await r.json()) as { path: string; signedUrl: string };
      const ok = await new Promise<boolean>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
        xhr.upload.onprogress = (e) => e.lengthComputable && setUpload({ name: file.name, pct: Math.round((e.loaded / e.total) * 100) });
        xhr.onload = () => resolve(xhr.status < 300);
        xhr.onerror = () => resolve(false);
        xhr.send(file);
      });
      setUpload(null);
      if (!ok) {
        alert("Upload failed");
        continue;
      }
      const caption = text.trim();
      setText("");
      await send({ body: caption || undefined, attachment_path: path, attachment_type: file.type, attachment_name: file.name, attachment_url: URL.createObjectURL(file) });
    }
  };

  const clearAll = async () => {
    if (!confirm("Delete every message and file for both of you? This cannot be undone.")) return;
    const r = await fetch("/api/chat/clear", { method: "DELETE" });
    if (r.ok) sync(true);
    else alert("Could not clear");
  };

  const logout = async () => {
    await fetch("/api/chat/logout", { method: "POST" });
    router.replace("/");
  };

  // paste images
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files || []);
      if (files.length) {
        e.preventDefault();
        sendFiles(files);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <main
      className="flex h-[100svh] flex-col bg-cream"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) sendFiles(e.dataTransfer.files);
      }}
    >
      <header className="flex items-center gap-2 border-b border-cocoa/10 bg-cream/90 px-3 py-3 backdrop-blur md:gap-3 md:px-4">
        <Hibiscus className="h-8 w-8 shrink-0 text-crimson" draw={false} strokeWidth={5} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-cocoa">Kitchen notes</p>
          <p className="text-[11px] text-cocoa/50">
            <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-amber-500"}`} />
            {online ? "live" : "reconnecting…"} · you: …{me.slice(-4)}
          </p>
        </div>
        <button
          onClick={toggleNotif}
          aria-label="Notifications"
          title={notif === "on" ? "Notifications on" : "Turn on notifications"}
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-base ${notif === "on" ? "border-crimson bg-crimson text-cream" : "border-cocoa/15 text-cocoa/60"}`}
        >
          {notif === "on" ? "🔔" : "🔕"}
        </button>
        {isOwner && (
          <button onClick={clearAll} className="rounded-full border border-crimson/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-crimson">
            Clear
          </button>
        )}
        <button onClick={logout} className="rounded-full border border-cocoa/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa/60">
          Exit
        </button>
      </header>

      <div ref={list} onScroll={onScroll} className="flex-1 overflow-y-auto px-3 py-4 md:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-1.5">
          {msgs.length === 0 && <p className="py-20 text-center text-sm text-cocoa/40">No messages yet. Say hi, or drop a photo here.</p>}
          {msgs.map((m, i) => {
            const mine = m.sender === me;
            const day = fmtDay(m.created_at);
            const showDay = i === 0 || day !== fmtDay(msgs[i - 1].created_at);
            return (
              <div key={m.id}>
                {showDay && (
                  <div className="my-3 flex justify-center">
                    <span className="rounded-full bg-paper px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa/50">{day}</span>
                  </div>
                )}
                <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] ${m.attachment_url ? "min-w-[220px]" : ""} rounded-[20px] px-3.5 py-2.5 text-[15px] leading-snug shadow-sm transition-opacity md:max-w-[70%] ${
                      mine ? "rounded-br-md bg-crimson text-cream" : "rounded-bl-md bg-paper text-cocoa"
                    } ${m.pending ? "opacity-60" : ""} ${m.failed ? "ring-2 ring-amber-400" : ""}`}
                  >
                    <Attachment m={m} />
                    {m.body && (
                      <p className={`whitespace-pre-wrap break-words ${m.attachment_url ? "mt-2" : ""}`}>
                        <Linkify text={m.body} />
                      </p>
                    )}
                    <p className={`mt-1 text-right text-[10px] ${mine ? "text-cream/60" : "text-cocoa/40"}`}>
                      {m.failed ? "not sent" : m.pending ? "sending…" : fmtTime(m.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottom} />
        </div>
      </div>

      {upload && (
        <div className="mx-auto w-full max-w-2xl px-4 pb-1 text-[11px] text-cocoa/60">
          Uploading {upload.name} · {upload.pct}%
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-cocoa/10">
            <div className="h-full bg-crimson transition-all" style={{ width: `${upload.pct}%` }} />
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendText();
        }}
        className="border-t border-cocoa/10 bg-cream px-3 py-2 md:px-6"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
            className="hidden"
            onChange={(e) => e.target.files && (sendFiles(e.target.files), (e.target.value = ""))}
          />
          <button type="button" onClick={() => fileInput.current?.click()} aria-label="Attach" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-xl text-cocoa">
            +
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !("ontouchstart" in window)) {
                e.preventDefault();
                sendText();
              }
            }}
            rows={1}
            placeholder="Message"
            className="max-h-40 min-h-11 flex-1 resize-none rounded-[22px] border border-cocoa/15 bg-white px-4 py-2.5 text-base text-cocoa outline-none focus:border-crimson"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button disabled={!text.trim()} aria-label="Send" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crimson text-cream disabled:opacity-40">
            ↑
          </button>
        </div>
      </form>
    </main>
  );
}
