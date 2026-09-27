"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import Hibiscus from "./Hibiscus";
import useIsMobile from "@/hooks/useIsMobile";
import { products } from "@/data/products";

const BASE_DELAY = 2.1;

const heroPicks = [
  products.find((p) => p.slug === "black-dark-forest")!,
  products.find((p) => p.slug === "korean-garlic-bun")!,
  products.find((p) => p.slug === "see-salt-cookies")!,
];

const stripPicks = [
  "black-dark-forest",
  "korean-garlic-bun",
  "see-salt-cookies",
  "lemon-raspberry-cheesecake",
  "tiramisu",
  "pesto-pinwheels",
  "brownie",
].map((slug) => products.find((p) => p.slug === slug)!);

function Word({ children, i }: { children: string; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: "110%", rotate: 4 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ delay: BASE_DELAY + 0.1 + i * 0.07, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });

  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -40 : -120]);
  const yCards = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 30 : 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const useCard = (depth: number) => ({
    x: useTransform(sx, (v) => v * depth * 18),
    y: useTransform(sy, (v) => v * depth * 14),
    rotate: useTransform(sx, (v) => v * depth * 2),
  });
  const c1 = useCard(1);
  const c2 = useCard(1.8);
  const c3 = useCard(1.3);

  const headline = "Healthier bakes for your mind & soul.".split(" ");

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden pb-10 pt-24 md:pb-0 md:pt-32">
      {/* backdrop glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[70vh] w-[110vw] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(142,27,27,0.10),transparent_60%)]" />

      {/* rotating hibiscus watermark */}
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute -right-24 top-16 text-crimson/[0.07] md:-right-10"
      >
        <Hibiscus className="animate-spin-slow h-[60vw] w-[60vw] max-h-[640px] max-w-[640px]" draw={false} strokeWidth={1.4} />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 md:grid-cols-12 md:px-8">
        <motion.div style={{ y: yText, opacity }} className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: BASE_DELAY, duration: 0.8 }}
            className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-crimson md:mb-6 md:text-[11px] md:tracking-[0.35em]"
          >
            <span className="h-px w-6 shrink-0 bg-crimson md:w-10" /> Cloud bakery · Andheri, Mumbai
          </motion.p>

          <h1 className="font-display text-[13vw] leading-[0.92] text-cocoa md:text-[6.4rem] lg:text-[7.4rem]">
            {headline.map((w, i) => (
              <span key={i}>
                <Word i={i}>{w}</Word>{" "}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: BASE_DELAY + 0.8, duration: 0.9 }}
            className="mt-6 max-w-md text-base leading-relaxed text-cocoa-soft md:mt-8 md:text-lg"
          >
            No refined sugar. No refined flour. Eggless, always — with vegan, gluten-free and keto
            options. Cakes, breads and cookies baked in small batches and delivered across Mumbai.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: BASE_DELAY + 1, duration: 0.9 }}
            className="mt-8 flex flex-wrap items-center gap-4 md:mt-10"
          >
            <a
              href="#showcase"
              className="btn-magnetic rounded-full bg-crimson px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-cream transition-colors hover:text-cocoa"
            >
              Explore the bakes
            </a>
            <a
              href="https://wa.me/919004439235"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/30 transition-all group-hover:border-crimson group-hover:bg-crimson group-hover:text-cream">
                ↗
              </span>
              Order now
            </a>
          </motion.div>
        </motion.div>

        {/* mobile: swipeable photo strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BASE_DELAY + 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="no-scrollbar -mx-5 mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:hidden"
        >
          {stripPicks.map((p, i) => (
            <a
              key={p.slug}
              href={`#p-${p.slug}`}
              className={`relative h-[240px] w-[170px] shrink-0 snap-center overflow-hidden ${
                i % 2 ? "rounded-[24px]" : "product-arch"
              } bg-sand shadow-[0_20px_40px_-20px_rgba(42,26,20,0.5)]`}
            >
              <img src={p.image} alt={p.name} loading={i < 3 ? "eager" : "lazy"} className="h-full w-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/80 to-transparent px-3 pb-3 pt-8">
                <span className="block font-display text-base leading-tight text-cream">{p.name}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-cream/75">{p.price}</span>
              </span>
            </a>
          ))}
          <a
            href="#menu"
            className="flex h-[240px] w-[120px] shrink-0 snap-center flex-col items-center justify-center gap-2 rounded-[24px] border border-dashed border-crimson/40 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-crimson"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson text-cream">→</span>
            All 26 bakes
          </a>
        </motion.div>

        {/* desktop: floating product cards */}
        <motion.div style={{ y: yCards }} className="relative mx-auto mt-4 hidden h-[300px] w-full max-w-[360px] md:col-span-5 md:mt-0 md:block md:h-[560px] md:max-w-none">
          <motion.figure
            style={{ x: c1.x, y: c1.y, rotate: c1.rotate }}
            initial={{ opacity: 0, y: 80, rotate: -8 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ delay: BASE_DELAY + 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="product-arch absolute left-0 top-4 h-[220px] w-[150px] overflow-hidden shadow-[0_30px_60px_-20px_rgba(42,26,20,0.45)] md:h-[400px] md:w-[280px]"
          >
            <img src={heroPicks[0].image} alt={heroPicks[0].name} className="h-full w-full object-cover" />
          </motion.figure>

          <motion.figure
            style={{ x: c2.x, y: c2.y, rotate: c2.rotate }}
            initial={{ opacity: 0, y: 80, rotate: 10 }}
            animate={{ opacity: 1, y: 0, rotate: 6 }}
            transition={{ delay: BASE_DELAY + 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-[160px] w-[125px] overflow-hidden rounded-[22px] shadow-[0_30px_60px_-20px_rgba(42,26,20,0.45)] md:h-[290px] md:w-[220px]"
          >
            <img src={heroPicks[1].image} alt={heroPicks[1].name} className="h-full w-full object-cover" />
          </motion.figure>

          <motion.figure
            style={{ x: c3.x, y: c3.y, rotate: c3.rotate }}
            initial={{ opacity: 0, y: 80, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ delay: BASE_DELAY + 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 right-4 h-[150px] w-[150px] overflow-hidden rounded-full shadow-[0_30px_60px_-20px_rgba(42,26,20,0.45)] md:h-[250px] md:w-[250px]"
          >
            <img src={heroPicks[2].image} alt={heroPicks[2].name} className="h-full w-full object-cover" />
          </motion.figure>

          {/* rotating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: BASE_DELAY + 1.1, duration: 0.8, type: "spring" }}
            className="absolute bottom-2 left-2 flex h-24 w-24 items-center justify-center rounded-full bg-gold text-cocoa md:bottom-16 md:left-12 md:h-32 md:w-32"
          >
            <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full">
              <defs>
                <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-cocoa text-[8.2px] font-semibold uppercase tracking-[0.18em]">
                <textPath href="#circ">No refined sugar · No refined flour · Eggless ·</textPath>
              </text>
            </svg>
            <Hibiscus className="h-8 w-8 md:h-10 md:w-10" draw={false} strokeWidth={5} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE_DELAY + 1.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cocoa/50 md:flex"
      >
        Scroll
        <span className="block h-10 w-px overflow-hidden bg-cocoa/15">
          <motion.span
            animate={{ y: [-40, 40] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="block h-full w-full bg-crimson"
          />
        </span>
      </motion.div>
    </section>
  );
}
