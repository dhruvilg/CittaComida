"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/products";
import Reveal, { SplitLines } from "./Reveal";

export default function Testimonials() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-crimson">Word of mouth</p>
        </Reveal>
        <h2 className="font-display max-w-3xl text-5xl leading-[1.02] text-cocoa md:text-7xl">
          <SplitLines text="Our clients say it better than we do." />
        </h2>

        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 40, rotate: i === 1 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="relative w-[82vw] shrink-0 snap-center rounded-[28px] bg-paper p-6 shadow-[0_20px_50px_-30px_rgba(42,26,20,0.4)] md:w-auto md:p-8"
            >
              <span className="font-display absolute -top-4 left-7 text-7xl leading-none text-crimson">&ldquo;</span>
              <p className="font-display mt-4 text-xl leading-snug text-cocoa md:text-2xl">{t.text}</p>
              <footer className="mt-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson text-xs font-semibold text-cream">
                  {t.name[0]}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cocoa/60">{t.name}</span>
                <span className="ml-auto text-gold">★★★★★</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
