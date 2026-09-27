"use client";

import { motion } from "framer-motion";
import Reveal, { SplitLines } from "./Reveal";

const pillars = [
  {
    n: "01",
    title: "No refined sugar",
    body: "Unrefined raw sugar, jaggery and fruit do the sweetening. Nothing white, nothing bleached.",
  },
  {
    n: "02",
    title: "No refined flour",
    body: "Whole wheat and our in-house gluten-free blends, ground for flavour and fibre — not just filler.",
  },
  {
    n: "03",
    title: "Eggless, always",
    body: "Every single bake. With vegan, gluten-free and keto editions across the menu.",
  },
  {
    n: "04",
    title: "Couverture, not compound",
    body: "Real cocoa butter chocolate in every ganache, cookie and spread. You can taste the difference.",
  },
];

export default function Pillars() {
  return (
    <section className="relative bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-crimson">
                What Citta means
              </p>
            </Reveal>
            <h2 className="font-display text-5xl leading-[1.02] text-cocoa md:text-6xl lg:text-7xl">
              <SplitLines text="Citta is Sanskrit for mindful. Comida is Spanish for food." />
            </h2>
            <Reveal delay={0.3}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-cocoa-soft">
                Put together, it&apos;s a promise: everything that leaves our kitchen is made with
                intention — for people who want dessert without the compromise.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ul className="divide-y divide-cocoa/10 border-y border-cocoa/10">
              {pillars.map((p, i) => (
                <motion.li
                  key={p.n}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-7 transition-colors hover:bg-paper/60 md:grid-cols-[4rem_1fr]"
                >
                  <span className="font-display-italic text-xl text-crimson">{p.n}</span>
                  <div>
                    <h3 className="font-display text-3xl text-cocoa transition-transform duration-500 group-hover:translate-x-2">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-md text-cocoa-soft">{p.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
