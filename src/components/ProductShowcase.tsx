"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/data/products";
import Hibiscus from "./Hibiscus";

gsap.registerPlugin(ScrollTrigger);

const total = products.length;
const pad = (n: number) => String(n).padStart(2, "0");

export default function ProductShowcase() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-product]");
      const mm = gsap.matchMedia();

      sections.forEach((section) => {
        const hasBack = section.dataset.hasBack === "true";
        const q = gsap.utils.selector(section);
        const card = q("[data-card]")[0];
        const disc = q("[data-disc]")[0];
        const ring = q("[data-ring]")[0];
        const nameChars = q("[data-char]");
        const lines = q("[data-line]");
        const chips = q("[data-chip]");
        const meta = q("[data-meta]");
        const num = q("[data-num]")[0];
        const bar = q("[data-bar]")[0];

        // initial states
        gsap.set(card, { rotateY: hasBack ? -30 : -28, rotateX: 10, scale: 0.82, transformPerspective: 1400 });
        gsap.set(disc, { rotate: -40, scale: 0.6, opacity: 0 });
        gsap.set(ring, { rotate: 60, scale: 0.5, opacity: 0 });
        gsap.set(nameChars, { yPercent: 110, rotate: 3 });
        gsap.set(lines, { yPercent: 40, opacity: 0 });
        gsap.set(chips, { y: 16, opacity: 0 });
        gsap.set(meta, { y: 20, opacity: 0 });
        gsap.set(num, { xPercent: -30, opacity: 0 });
        gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
          defaults: { ease: "none" },
        });

        // 0 → 1 mapping over section scroll
        tl.to(bar, { scaleX: 1, duration: 1 }, 0)
          .to(num, { xPercent: 0, opacity: 1, duration: 0.12, ease: "power2.out" }, 0)
          .to(nameChars, { yPercent: 0, rotate: 0, duration: 0.16, stagger: 0.012, ease: "power3.out" }, 0.02)
          .to(disc, { rotate: 0, scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" }, 0)
          .to(ring, { rotate: 0, scale: 1, opacity: 1, duration: 0.24, ease: "power2.out" }, 0.03)
          .to(card, { scale: 1, rotateX: 4, duration: 0.2, ease: "power2.out" }, 0.02)
          .to(
            card,
            hasBack
              ? { rotateY: 210, rotateX: -4, duration: 0.86, ease: "power1.inOut" }
              : { rotateY: 28, rotateX: -6, duration: 0.86, ease: "power1.inOut" },
            0.08
          )
          .to(disc, { rotate: 180, duration: 0.9 }, 0.08)
          .to(ring, { rotate: -140, duration: 0.9 }, 0.08)
          .to(lines, { yPercent: 0, opacity: 1, duration: 0.18, stagger: 0.05, ease: "power2.out" }, 0.18)
          .to(chips, { y: 0, opacity: 1, duration: 0.12, stagger: 0.03, ease: "power2.out" }, 0.42)
          .to(meta, { y: 0, opacity: 1, duration: 0.14, stagger: 0.05, ease: "power2.out" }, 0.52);
      });

      // subtle idle float on desktop only
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((el, i) => {
          gsap.to(el, { y: -10, duration: 3 + (i % 3), yoyo: true, repeat: -1, ease: "sine.inOut" });
        });
      });
    }, root);

    // refresh once images settle
    const t = setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <div id="showcase" ref={root} className="relative bg-cream">
      {/* section intro */}
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-24 md:px-8 md:pt-32">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-crimson">The bakes</p>
        <h2 className="font-display max-w-4xl text-4xl leading-[1.02] text-cocoa md:text-7xl">
          Every bake, up close. <span className="font-display-italic text-crimson">Keep scrolling.</span>
        </h2>
        <p className="mt-4 max-w-lg text-sm text-cocoa-soft md:text-base">
          Or jump straight to the one you&apos;re craving:
        </p>
        <div className="no-scrollbar -mx-5 mt-4 flex snap-x gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {products.map((p, i) => (
            <a
              key={p.slug}
              href={`#p-${p.slug}`}
              className="flex shrink-0 snap-start items-center gap-2 rounded-full border border-cocoa/15 bg-cream py-1.5 pl-1.5 pr-3.5 text-[11px] font-medium text-cocoa transition-colors hover:border-crimson hover:text-crimson"
            >
              <img src={p.image} alt="" className="h-6 w-6 rounded-full object-cover" loading="lazy" />
              <span className="font-display-italic text-xs text-crimson">{pad(i + 1)}</span>
              {p.name}
            </a>
          ))}
        </div>
      </div>

      {products.map((p, i) => {
        const flip = i % 2 === 1;
        const hasBack = Boolean(p.imageAlt);
        const orderLink = `https://wa.me/91904439235?text=${encodeURIComponent(`Hi Citta Comida! I'd like to order: ${p.name}`)}`;
        return (
          <section
            key={p.slug}
            id={`p-${p.slug}`}
            data-product
            data-has-back={hasBack ? "true" : "false"}
            className="relative h-[150vh] md:h-[200vh]"
          >
            <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
              {/* progress bar */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-cocoa/10">
                <div data-bar className="h-full w-full" style={{ background: p.accent }} />
              </div>

              <div
                className={`mx-auto grid h-full w-full max-w-7xl grid-cols-1 content-start gap-3 px-5 pb-16 pt-[4.5rem] md:grid-cols-12 md:content-center md:items-center md:gap-10 md:px-8 md:pb-8 md:pt-24 ${
                  flip ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* 3D stage */}
                <div className="relative flex h-[34svh] items-center justify-center md:col-span-6 md:h-full">
                  <div data-stage className="relative flex items-center justify-center [perspective:1400px]">
                    <div
                      data-disc
                      className="absolute h-[30svh] w-[30svh] max-h-[520px] max-w-[520px] rounded-full md:h-[34vw] md:w-[34vw]"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${p.accent}33, ${p.accent} 70%)`,
                      }}
                    />
                    <div
                      data-ring
                      className="absolute h-[36svh] w-[36svh] max-h-[620px] max-w-[620px] rounded-full border border-dashed md:h-[41vw] md:w-[41vw]"
                      style={{ borderColor: `${p.accent}66` }}
                    >
                      <Hibiscus
                        className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 text-crimson"
                        draw={false}
                        strokeWidth={5}
                      />
                    </div>

                    <div
                      data-card
                      className="preserve-3d relative h-[30svh] w-[21svh] md:h-[62vh] md:w-[44vh]"
                    >
                      <figure className="product-arch absolute inset-0 overflow-hidden bg-paper shadow-[0_40px_80px_-30px_rgba(42,26,20,0.55)] [backface-visibility:hidden]">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading={i < 2 ? "eager" : "lazy"}
                          className="h-full w-full object-cover"
                        />
                        <figcaption className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-cream/90 px-3 py-1 text-[9px] md:bottom-4 md:px-4 md:py-1.5 md:text-[10px] font-semibold uppercase tracking-[0.25em] text-cocoa backdrop-blur">
                          {p.category}
                        </figcaption>
                      </figure>
                      {hasBack && (
                        <figure className="product-arch absolute inset-0 overflow-hidden bg-paper shadow-[0_40px_80px_-30px_rgba(42,26,20,0.55)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <img src={p.imageAlt} alt={`${p.name} — another view`} loading="lazy" className="h-full w-full object-cover" />
                          <figcaption className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-crimson px-3 py-1 text-[9px] md:bottom-4 md:px-4 md:py-1.5 md:text-[10px] font-semibold uppercase tracking-[0.25em] text-cream">
                            {p.price}
                          </figcaption>
                        </figure>
                      )}
                    </div>
                  </div>
                </div>

                {/* copy */}
                <div className="relative md:col-span-6">
                  <div className="mb-1.5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-crimson md:mb-5 md:gap-4 md:text-[11px] md:tracking-[0.35em]">
                    <span data-num className="font-display-italic text-xl tracking-normal md:text-3xl">
                      {pad(i + 1)}
                    </span>
                    <span className="h-px w-8 bg-crimson/40" />
                    <span className="text-cocoa/50">
                      {pad(total)} · {p.category}
                    </span>
                  </div>

                  <h3
                    className="font-display text-[8.5vw] leading-[0.95] text-cocoa md:text-[4.6rem] lg:text-[5.4rem]"
                    aria-label={p.name}
                  >
                    {p.name.split(" ").map((w, wi) => (
                      <span key={wi} className="inline-block whitespace-nowrap">
                        {w.split("").map((c, ci) => (
                          <span key={ci} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                            <span data-char className="inline-block">
                              {c}
                            </span>
                          </span>
                        ))}
                        {wi < p.name.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
                      </span>
                    ))}
                  </h3>

                  <p data-line className="font-display-italic mt-2 text-base text-crimson md:mt-5 md:text-2xl">
                    {p.tagline}
                  </p>
                  <p data-line className="mt-2 line-clamp-3 max-w-lg text-[13.5px] leading-snug text-cocoa-soft sm:line-clamp-4 md:mt-4 md:line-clamp-none md:text-lg md:leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 md:mt-5 md:gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        data-chip
                        className="rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] md:px-3 md:py-1 md:text-[10px] md:tracking-[0.2em]"
                        style={{ borderColor: `${p.accent}55`, color: p.accent }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4 md:mt-8 md:grid md:grid-cols-[auto_1fr] md:gap-8">
                    <div data-meta>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cocoa/50">Price</p>
                      <p className="font-display mt-0.5 text-3xl text-cocoa md:mt-1 md:text-5xl">{p.price}</p>
                    </div>
                    {p.options && (
                      <div data-meta className="hidden md:block">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cocoa/50">Options</p>
                        <p className="mt-1 text-sm leading-relaxed text-cocoa-soft">{p.options.join(" · ")}</p>
                      </div>
                    )}
                    <a
                      data-meta
                      href={orderLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-magnetic rounded-full bg-crimson px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-cream transition-colors hover:text-cocoa md:hidden"
                    >
                      Order this
                    </a>
                  </div>

                  <div data-meta className="mt-8 hidden flex-wrap items-center gap-4 md:flex">
                    <a
                      href={orderLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-magnetic rounded-full bg-crimson px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream transition-colors hover:text-cocoa"
                    >
                      Order this
                    </a>
                    {p.allergens && <span className="text-xs text-cocoa/50">Allergens: {p.allergens}</span>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
