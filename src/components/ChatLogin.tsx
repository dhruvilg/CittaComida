"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Hibiscus from "@/components/Hibiscus";

export default function ChatLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/chat/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, pin }),
    });
    setBusy(false);
    if (r.ok) router.refresh();
    else setErr((await r.json().catch(() => ({}))).error || "Not allowed");
  };

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-cream px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[28px] bg-paper p-8 shadow-[0_30px_60px_-30px_rgba(42,26,20,0.4)]">
        <div className="flex items-center gap-3 text-crimson">
          <Hibiscus className="h-9 w-9" draw={false} strokeWidth={5} />
          <span className="text-xs font-semibold uppercase tracking-[0.3em]">Kitchen notes</span>
        </div>
        <h1 className="font-display mt-6 text-3xl text-cocoa">Sign in</h1>
        <label className="mt-6 block text-[11px] font-semibold uppercase tracking-[0.25em] text-cocoa/60">
          Phone
          <input
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 h-12 w-full rounded-full border border-cocoa/15 bg-cream px-5 text-base tracking-wider text-cocoa outline-none focus:border-crimson"
            placeholder="98XXXXXXXX"
          />
        </label>
        <label className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.25em] text-cocoa/60">
          PIN
          <input
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mt-2 h-12 w-full rounded-full border border-cocoa/15 bg-cream px-5 text-base tracking-[0.5em] text-cocoa outline-none focus:border-crimson"
            placeholder="••••"
          />
        </label>
        {err && <p className="mt-3 text-sm text-crimson">{err}</p>}
        <button
          disabled={busy}
          className="mt-6 h-12 w-full rounded-full bg-crimson text-xs font-semibold uppercase tracking-[0.25em] text-cream disabled:opacity-60"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
