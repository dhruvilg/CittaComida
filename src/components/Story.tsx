"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal, { SplitLines } from "./Reveal";
import Hibiscus from "./Hibiscus";
import { products } from "@/data/products";
import useIsMobile from "@/hooks/useIsMobile";

const stats = [
  { v: "2020", l: "Baking since" },
  { v: "13", l: "Minds in the kitchen" },
  { v: "26", l: "Bakes on the menu" },
  { v: "0", l: "Refined sugar or flour" },
];

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const isMobile = useIsMobile();
  const y1 = useTransform(scrollYProgress, [0, 1], isMobile ? [20, -20] : [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], isMobile ? [-10, 30] : [-40, 120]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const a = products.find((p) => p.slug === "pesto-pinwheels")!;
  const b = products.find((p) => p.slug === "lemon-raspberry-cheesecake")!;

  return (
    <section id="story" ref={ref} className="relative overflow-hidden bg-crimson py-24 text-cream md:py-36">
      <motion.div style={{ rotate: rot }} className="pointer-events-none absolute -left-40 top-10 text-cream/[0.06]">
        <Hibiscus className="h-[70vw] w-[70vw] max-h-[720px] max-w-[720px]" draw={false} strokeWidth={1.2} />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-6">
          <Reveal>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Our story</p>
          </Reveal>
          <h2 className="font-display text-5xl leading-[1.02] md:text-6xl lg:text-7xl">
            <SplitLines text="It started with cookies for friends. It became a kitchen of thirteen." />
          </h2>
          <Reveal delay={0.2}>
            <div className="mt-8 max-w-lg space-y-5 text-lg leading-relaxed text-cream/85">
              <p>
                Our founder Manasvvi came home to Mumbai from business school in Nottingham and started
                baking for the people she loved — cookies, cakes, endless trials. Serving them was the
                best part. In August 2020, Citta Comida was born to serve healthier bakes to everyone else.
              </p>
              <p>
                Since moving into our cloud bakery in 2023, we&apos;ve curated a menu that meets different
                nutrition needs without forgetting a real budget. We ask for feedback constantly, and we
                take it seriously.
              </p>
              <p className="font-display-italic text-2xl text-gold">
                A women-led kitchen of creative minds who just want to learn more about baking.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-cream/15 pt-8 md:mt-12 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.l} delay={0.1 * i}>
                <p className="font-display text-5xl text-cream">{s.v}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-cream/60">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="relative h-[440px] md:col-span-5 md:col-start-8 md:h-auto">
          <motion.figure
            style={{ y: y1 }}
            className="product-arch absolute left-0 top-0 h-[320px] w-[62%] overflow-hidden shadow-2xl md:h-[480px]"
          >
            <img src={a.image} alt={a.name} loading="lazy" className="h-full w-full object-cover" />
          </motion.figure>
          <motion.figure
            style={{ y: y2 }}
            className="absolute bottom-0 right-0 h-[220px] w-[52%] overflow-hidden rounded-[26px] border-4 border-crimson shadow-2xl md:h-[340px]"
          >
            <img src={b.image} alt={b.name} loading="lazy" className="h-full w-full object-cover" />
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
