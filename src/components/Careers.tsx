"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal, { SplitLines } from "./Reveal";

const WA_NUMBER = "919004439235";

export const roles = [
  {
    id: "baker",
    title: "Baker / Pastry Chef",
    type: "Full-time",
    blurb: "Cakes, cookies, breads and cheesecakes — eggless, whole-wheat, no refined sugar. We'll teach you our recipes.",
    points: ["Baking experience preferred", "Comfortable with early shifts", "Eye for finishing & detail"],
  },
  {
    id: "helper",
    title: "Kitchen Helper",
    type: "Full-time / Part-time",
    blurb: "Prep, weighing, packing, and keeping a clean, happy kitchen running. A great way to start in baking.",
    points: ["No experience needed", "Willing to learn", "Reliable & hygienic"],
  },
  {
    id: "delivery",
    title: "Delivery / Dispatch",
    type: "Full-time / Part-time",
    blurb: "Pack orders, coordinate pickups with delivery partners, and make sure every box leaves on time.",
    points: ["Knows Andheri & nearby areas", "Smartphone + WhatsApp", "Organised & punctual"],
  },
  {
    id: "other",
    title: "Something else?",
    type: "Open application",
    blurb: "Social media, photography, sales, admin — if you love what we do, tell us how you'd help.",
    points: ["Any background", "Tell us your idea", "We read every message"],
  },
];

const experience = ["Fresher", "Under 1 year", "1–3 years", "3+ years"];
const availability = ["Full-time", "Part-time", "Weekends only"];

const field =
  "mt-1.5 h-12 w-full rounded-2xl border border-cocoa/15 bg-white/70 px-4 text-base font-normal normal-case tracking-normal text-cocoa outline-none transition-colors focus:border-crimson";
const label = "block text-[10px] font-semibold uppercase tracking-[0.25em] text-cocoa/60";

export default function Careers({ standalone = false }: { standalone?: boolean }) {
  const [role, setRole] = useState<string>("");
  const [form, setForm] = useState({ name: "", phone: "", area: "", exp: "", avail: "", note: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const pick = (id: string) => {
    setRole(id);
    setErr("");
    setTimeout(() => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = form.phone.replace(/\D/g, "").slice(-10);
    if (!role) return setErr("Please choose a role above.");
    if (form.name.trim().length < 2) return setErr("Please enter your name.");
    if (phone.length !== 10) return setErr("Please enter a 10-digit mobile number.");
    if (!form.area.trim()) return setErr("Please tell us where you live.");
    setErr("");

    const r = roles.find((x) => x.id === role)!;
    const lines: string[] = [
      "Hi Citta Comida! 👋 I'd like to apply for a job.",
      "",
      `*Role:* ${r.title}`,
      `*Name:* ${form.name.trim()}`,
      `*Phone:* ${phone}`,
      `*Area:* ${form.area.trim()}`,
      ...(form.exp ? [`*Experience:* ${form.exp}`] : []),
      ...(form.avail ? [`*Availability:* ${form.avail}`] : []),
      ...(form.note.trim() ? [`*About me:* ${form.note.trim()}`] : []),
      "",
      "(I'll attach my resume / photos of my work here.)",
    ];

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
    setSent(true);
  };

  const selected = roles.find((r) => r.id === role);

  return (
    <section id="careers" className={`relative bg-paper ${standalone ? "pb-24 pt-28 md:pb-32 md:pt-36" : "py-24 md:py-32"}`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-crimson">Careers · We&apos;re hiring</p>
            </Reveal>
            <h2 className="font-display text-5xl leading-[1.02] text-cocoa md:text-7xl">
              <SplitLines text="Bake with us." />
            </h2>
          </div>
          <Reveal delay={0.15} className="md:col-span-5">
            <p className="text-base leading-relaxed text-cocoa-soft md:text-lg">
              A women-led kitchen of thirteen in Andheri, baking healthier every day. Pick a role, fill in a few details,
              and your application lands straight on our WhatsApp.
            </p>
          </Reveal>
        </div>

        {/* role cards */}
        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-14 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
          {roles.map((r, i) => {
            const active = role === r.id;
            return (
              <motion.button
                key={r.id}
                type="button"
                onClick={() => pick(r.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                aria-pressed={active}
                className={`group flex w-[78vw] shrink-0 snap-center flex-col rounded-[26px] border p-6 text-left transition-colors md:w-auto ${
                  active ? "border-crimson bg-crimson text-cream" : "border-cocoa/10 bg-cream text-cocoa hover:border-crimson/40"
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${active ? "text-gold" : "text-crimson"}`}>{r.type}</span>
                <h3 className="font-display mt-3 text-2xl leading-tight md:text-[1.7rem]">{r.title}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${active ? "text-cream/80" : "text-cocoa-soft"}`}>{r.blurb}</p>
                <ul className="mt-4 space-y-1.5">
                  {r.points.map((p) => (
                    <li key={p} className={`flex items-start gap-2 text-[13px] ${active ? "text-cream/85" : "text-cocoa/70"}`}>
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-gold" : "bg-crimson"}`} />
                      {p}
                    </li>
                  ))}
                </ul>
                <span
                  className={`mt-auto inline-flex items-center gap-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    active ? "text-gold" : "text-crimson"
                  }`}
                >
                  {active ? "Selected ✓" : "Apply for this →"}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* form */}
        <div id="apply-form" className="scroll-mt-24">
          <Reveal className="mt-10 md:mt-14">
            <form onSubmit={submit} className="mx-auto max-w-3xl rounded-[28px] bg-cream p-6 shadow-[0_30px_60px_-35px_rgba(42,26,20,0.45)] md:p-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-3xl text-cocoa">Your application</h3>
                <p className="text-sm text-cocoa/60">
                  {selected ? (
                    <>
                      Applying for <span className="font-semibold text-crimson">{selected.title}</span>
                    </>
                  ) : (
                    "Choose a role above"
                  )}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className={label}>
                  Full name
                  <input className={field} value={form.name} onChange={set("name")} autoComplete="name" placeholder="Your name" />
                </label>
                <label className={label}>
                  Mobile number
                  <input className={field} value={form.phone} onChange={set("phone")} inputMode="numeric" autoComplete="tel" placeholder="98XXXXXXXX" />
                </label>
                <label className={label}>
                  Where do you live?
                  <input className={field} value={form.area} onChange={set("area")} placeholder="e.g. Andheri East" />
                </label>
                <label className={label}>
                  Role
                  <select className={field} value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select a role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={label}>
                  Experience
                  <select className={field} value={form.exp} onChange={set("exp")}>
                    <option value="">Select</option>
                    {experience.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label className={label}>
                  Availability
                  <select className={field} value={form.avail} onChange={set("avail")}>
                    <option value="">Select</option>
                    {availability.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label className={`${label} md:col-span-2`}>
                  Tell us about yourself <span className="normal-case tracking-normal text-cocoa/40">(optional)</span>
                  <textarea
                    className={`${field} h-auto min-h-24 resize-y py-3`}
                    value={form.note}
                    onChange={set("note")}
                    maxLength={600}
                    placeholder="Where you've worked, what you love baking, languages you speak…"
                  />
                </label>
              </div>

              {err && <p className="mt-4 text-sm text-crimson">{err}</p>}

              <div className="mt-6 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <p className="max-w-sm text-xs leading-relaxed text-cocoa/55">
                  This opens WhatsApp with your details filled in — just press send. You can attach your resume or photos of your bakes there.
                </p>
                <button
                  type="submit"
                  className="btn-magnetic flex h-12 shrink-0 items-center gap-2 rounded-full bg-crimson px-7 text-xs font-semibold uppercase tracking-[0.22em] text-cream transition-colors hover:text-cocoa"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2" />
                  </svg>
                  Apply on WhatsApp
                </button>
              </div>

              <AnimatePresence>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 rounded-2xl bg-paper px-4 py-3 text-sm text-cocoa"
                  >
                    WhatsApp should have opened — don&apos;t forget to press <b>send</b>. Didn&apos;t open?{" "}
                    <a className="font-semibold text-crimson underline" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer">
                      Message us directly
                    </a>
                    .
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
