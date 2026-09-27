"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products, categories, type Category } from "@/data/products";
import Reveal, { SplitLines } from "./Reveal";

export default function MenuGrid() {
  const [active, setActive] = useState<Category | "All">("All");
  const list = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section id="menu" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-crimson">The menu</p>
            </Reveal>
            <h2 className="font-display text-5xl leading-[1.02] text-cocoa md:text-7xl">
              <SplitLines text="Twenty-six reasons to skip the store-bought." />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <div className="no-scrollbar -mx-5 flex snap-x gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
              {(["All", ...categories] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`shrink-0 snap-start rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all md:px-4 md:py-2 md:text-[11px] md:tracking-[0.2em] ${
                    active === c
                      ? "border-crimson bg-crimson text-cream"
                      : "border-cocoa/20 text-cocoa/70 hover:border-crimson hover:text-crimson"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.ul layout className="mt-10 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-14 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li
                layout
                key={p.slug}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.5), ease: [0.22, 1, 0.36, 1] }}
              >
                <a href={`#p-${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-sand">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-cocoa backdrop-blur">
                      {p.tags[0]}
                    </span>
                    <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-cream text-cocoa opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      ↓
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div>
                      <h3 className="font-display text-lg leading-tight text-cocoa md:text-2xl">{p.name}</h3>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-cocoa/50 md:text-[11px] md:tracking-[0.2em]">{p.category}</p>
                    </div>
                    <span className="shrink-0 font-display text-base text-crimson md:text-lg">{p.price}</span>
                  </div>
                </a>
                <a
                  href={`https://wa.me/91904439235?text=${encodeURIComponent(`Hi Citta Comida! I'd like to order: ${p.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex h-9 items-center justify-center rounded-full border border-crimson/30 text-[10px] font-semibold uppercase tracking-[0.2em] text-crimson transition-colors hover:bg-crimson hover:text-cream md:h-10"
                >
                  Order on WhatsApp
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
