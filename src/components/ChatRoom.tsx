"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Hibiscus from "@/components/Hibiscus";
import type { ChatMessage } from "@/app/api/chat/[action]/route";

const POLL_MS = 3000;
const urlRe = /(https?:\/\/[^\s<]+)/g;

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

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
const fmtDay = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
};

export default function ChatRoom({ me, isOwner }: { me: string; isOwner: boolean }) {
  const router = useRouter();
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [upload, setUpload] = useState<{ name: string; pct: number } | null>(null);
  const [online, setOnline] = useState(true);
  const lastId = useRef(0);
  const bottom = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const stuckToBottom = useRef(true);

  const scrollToBottom = (smooth = true) =>
    bottom.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });

  const fetchNew = useCallback(async () => {
    try {
      const r = await fetch(`/api/chat/messages?after=${lastId.current}`, { cache: "no-store" });
      if (r.status === 401) return router.refresh();
      if (!r.ok) throw new Error();
      const { messages } = (await r.json()) as { messages: ChatMessage[] };
      setOnline(true);
      if (messages.length) {
        lastId.current = messages[messages.length - 1].id;
        setMsgs((prev) => {
          // a cleared chat comes back with ids restarting → replace
          const merged = prev.length && messages[0].id <= prev[prev.length - 1].id ? messages : [...prev, ...messages];
          return merged;
        });
        if (stuckToBottom.current) setTimeout(() => scrollToBottom(), 50);
      }
    } catch {
      setOnline(false);
    }
  }, [router]);

  // full reload (initial + after clear)
  const reloadAll = useCallback(async () => {
    lastId.current = 0;
    const r = await fetch(`/api/chat/messages`, { cache: "no-store" });
    if (!r.ok) return;
    const { messages } = (await r.json()) as { messages: ChatMessage[] };
    setMsgs(messages);
    lastId.current = messages.at(-1)?.id || 0;
    setTimeout(() => scrollToBottom(false), 30);
  }, []);

  useEffect(() => {
    const t = setTimeout(reloadAll, 0);
    const id = setInterval(() => document.visibilityState === "visible" && fetchNew(), POLL_MS);
    const onVis = () => document.visibilityState === "visible" && fetchNew();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimeout(t);
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [fetchNew, reloadAll]);

  // detect a remote clear: poll every 15s for count mismatch
  useEffect(() => {
    const id = setInterval(async () => {
      const r = await fetch(`/api/chat/messages`, { cache: "no-store" });
      if (!r.ok) return;
      const { messages } = (await r.json()) as { messages: ChatMessage[] };
      if (messages.length < msgs.length || (messages.at(-1)?.id || 0) < lastId.current) {
        setMsgs(messages);
        lastId.current = messages.at(-1)?.id || 0;
      }
    }, 15000);
    return () => clearInterval(id);
  }, [msgs.length]);

  const onScroll = () => {
    const el = list.current;
    if (!el) return;
    stuckToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const send = async (payload: Record<string, unknown>) => {
    setSending(true);
    const r = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSending(false);
    if (r.ok) {
      stuckToBottom.current = true;
      await fetchNew();
    }
  };

  const sendText = async () => {
    const body = text.trim();
    if (!body) return;
    setText("");
    await send({ body });
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
      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
        xhr.upload.onprogress = (e) => e.lengthComputable && setUpload({ name: file.name, pct: Math.round((e.loaded / e.total) * 100) });
        xhr.onload = async () => {
          if (xhr.status < 300) {
            await send({ body: text.trim() || undefined, attachment_path: path, attachment_type: file.type, attachment_name: file.name });
            setText("");
          } else alert("Upload failed");
          resolve();
        };
        xhr.onerror = () => (alert("Upload failed"), resolve());
        xhr.send(file);
      });
      setUpload(null);
    }
  };

  const clearAll = async () => {
    if (!confirm("Delete every message and file for both of you? This cannot be undone.")) return;
    const r = await fetch("/api/chat/clear", { method: "DELETE" });
    if (r.ok) reloadAll();
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
      <header className="flex items-center gap-3 border-b border-cocoa/10 bg-cream/90 px-4 py-3 backdrop-blur">
        <Hibiscus className="h-8 w-8 text-crimson" draw={false} strokeWidth={5} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-cocoa">Kitchen notes</p>
          <p className="text-[11px] text-cocoa/50">
            <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-amber-500"}`} />
            {online ? "live" : "reconnecting…"} · you: …{me.slice(-4)}
          </p>
        </div>
        {isOwner && (
          <button onClick={clearAll} className="rounded-full border border-crimson/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-crimson">
            Clear all
          </button>
        )}
        <button onClick={logout} className="rounded-full border border-cocoa/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa/60">
          Exit
        </button>
      </header>

      <div ref={list} onScroll={onScroll} className="flex-1 overflow-y-auto px-3 py-4 md:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-1.5">
          {msgs.length === 0 && (
            <p className="py-20 text-center text-sm text-cocoa/40">No messages yet. Say hi, or drop a photo here.</p>
          )}
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
                    className={`max-w-[82%] ${m.attachment_url ? "min-w-[220px]" : ""} rounded-[20px] px-3.5 py-2.5 text-[15px] leading-snug shadow-sm md:max-w-[70%] ${
                      mine ? "rounded-br-md bg-crimson text-cream" : "rounded-bl-md bg-paper text-cocoa"
                    }`}
                  >
                    <Attachment m={m} />
                    {m.body && <p className={`whitespace-pre-wrap break-words ${m.attachment_url ? "mt-2" : ""}`}><Linkify text={m.body} /></p>}
                    <p className={`mt-1 text-right text-[10px] ${mine ? "text-cream/60" : "text-cocoa/40"}`}>{fmtTime(m.created_at)}</p>
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
          <input ref={fileInput} type="file" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" className="hidden" onChange={(e) => e.target.files && (sendFiles(e.target.files), (e.target.value = ""))} />
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
          <button
            disabled={sending || !text.trim()}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crimson text-cream disabled:opacity-40"
          >
            ↑
          </button>
        </div>
      </form>
    </main>
  );
}
