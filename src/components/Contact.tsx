"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import Hibiscus from "./Hibiscus";
import SecretTap from "./SecretTap";

const steps = [
  { n: "01", t: "Pick your bakes", d: "Browse the menu, note the sizes and flavours you'd like." },
  { n: "02", t: "Message us on WhatsApp", d: "Send your list, delivery address and preferred date. We confirm within the hour." },
  { n: "03", t: "Pay via UPI or bank transfer", d: "No cash on delivery — it keeps things simple and safe for our team." },
  { n: "04", t: "Delivered to your door", d: "Across Mumbai, Thane & Navi Mumbai via Wefast, Swiggy Genie, Dunzo or Uber. Or pick up in Andheri." },
];

export default function Contact() {
  return (
    <>
      <section id="contact" className="relative overflow-hidden bg-cocoa py-24 text-cream md:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,78,0.16),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 md:grid-cols-12 md:px-8">
          <div className="md:col-span-6">
            <Reveal>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Order</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-5xl leading-[1.02] md:text-7xl">
                Craving something? <span className="font-display-italic text-gold">Say hello.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-cream/75">
                Orders, allergen questions, custom celebration cakes, and corporate or bulk gifting — one
                message does it all.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/919004439235"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa"
                >
                  WhatsApp +91 90044 39235
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://www.instagram.com/cittacomida"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cream/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  Instagram
                </motion.a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-[3rem_1fr] gap-4 rounded-2xl border border-cream/10 p-5 transition-colors hover:border-gold/50 hover:bg-cream/[0.03]"
                >
                  <span className="font-display-italic text-2xl text-gold">{s.n}</span>
                  <div>
                    <h3 className="font-display text-2xl">{s.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-cream/65">{s.d}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <footer className="bg-cocoa text-cream/70">
        <div className="mx-auto max-w-7xl border-t border-cream/10 px-5 py-12 md:px-8">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3 text-cream">
                <SecretTap>
                  <Hibiscus className="h-10 w-10 text-gold" draw={false} strokeWidth={5} />
                </SecretTap>
                <span className="text-sm font-medium uppercase tracking-[0.32em]">Citta Comida</span>
              </div>
              <p className="font-display-italic mt-3 text-xl text-cream/60">Food for your mind &amp; soul</p>
              <p className="mt-4 max-w-sm text-sm">
                Cloud bakery · Andheri, Mumbai. Delivering across Mumbai, Thane &amp; Navi Mumbai. Pick-up
                available.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.25em]">
              <li><a href="#menu" className="hover:text-gold">Menu</a></li>
              <li><a href="#showcase" className="hover:text-gold">The bakes</a></li>
              <li><a href="#story" className="hover:text-gold">Our story</a></li>
              <li><a href="#contact" className="hover:text-gold">Contact</a></li>
              <li><a href="/careers" className="hover:text-gold">Careers</a></li>
              <li><a href="https://wa.me/919004439235" className="hover:text-gold">Corporate &amp; bulk</a></li>
              <li><a href="https://www.instagram.com/cittacomida" className="hover:text-gold">Instagram</a></li>
            </ul>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-cream/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-cream/40 md:flex-row md:justify-between">
            <span>© {new Date().getFullYear()} Citta Comida. All rights reserved.</span>
            <span>Payments via UPI &amp; bank transfer · No cash on delivery</span>
          </div>
        </div>
      </footer>
    </>
  );
}
