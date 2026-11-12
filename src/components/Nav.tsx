"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hibiscus from "./Hibiscus";
import SecretTap from "./SecretTap";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#showcase", label: "The Bakes" },
  { href: "#story", label: "Our Story" },
  { href: "#careers", label: "Careers" },
  { href: "#contact", label: "Order" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-cream/80 backdrop-blur-md shadow-[0_1px_0_0_rgba(42,26,20,0.08)]" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" onClick={() => setOpen(false)} className={`group flex items-center gap-3 transition-colors ${open ? "text-cream" : "text-crimson"}`}>
            <SecretTap>
              <Hibiscus className="h-9 w-9 transition-transform duration-700 group-hover:rotate-12" draw={false} strokeWidth={5} />
            </SecretTap>
            <span className="font-sans text-[15px] font-medium uppercase tracking-[0.32em]">
              Citta Comida
            </span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative text-[13px] font-medium uppercase tracking-[0.22em] text-cocoa/80 transition-colors hover:text-crimson after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-crimson after:transition-all after:duration-500 hover:after:w-full"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://wa.me/919004439235"
                target="_blank"
                rel="noreferrer"
                className="btn-magnetic rounded-full bg-crimson px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-cream transition-colors hover:text-cocoa"
              >
                Order on WhatsApp
              </a>
            </li>
          </ul>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`h-px w-6 transition-all ${open ? "translate-y-[3.5px] rotate-45 bg-cream" : "bg-cocoa"}`} />
            <span className={`h-px w-6 transition-all ${open ? "-translate-y-[3.5px] -rotate-45 bg-cream" : "bg-cocoa"}`} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-crimson text-cream md:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="font-display text-5xl"
              >
                {l.label}
              </motion.a>
            ))}
            <a
              href="https://wa.me/919004439235"
              className="mt-6 rounded-full border border-cream/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em]"
            >
              Order on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
