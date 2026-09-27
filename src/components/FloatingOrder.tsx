"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WA = "https://wa.me/919004439235";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 1.67a8.24 8.24 0 0 1 8.24 8.24 8.24 8.24 0 0 1-8.24 8.24c-1.51 0-2.98-.41-4.26-1.18l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.35 8.24 8.24 0 0 1 8.31-8.24m-3.4 4.44c-.16 0-.43.06-.65.3-.23.24-.87.85-.87 2.07s.89 2.4 1.01 2.57c.13.16 1.75 2.67 4.23 3.74 2.06.81 2.48.65 2.93.61.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.77.96-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.02-.38.11-.5.11-.11.24-.28.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.5" />
    </svg>
  );
}

export default function FloatingOrder() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* mobile: bottom bar */}
          <motion.div
            key="bar"
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-full bg-cocoa/95 p-1.5 pl-2 shadow-[0_20px_50px_-15px_rgba(42,26,20,0.6)] backdrop-blur md:hidden"
            style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
          >
            <a
              href="#menu"
              className="flex h-11 flex-1 items-center justify-center rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/85"
            >
              Menu
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 flex-[1.6] items-center justify-center gap-2 rounded-full bg-crimson text-[11px] font-semibold uppercase tracking-[0.2em] text-cream"
            >
              <WhatsAppIcon className="h-4 w-4" /> Order now
            </a>
          </motion.div>

          {/* desktop: round button */}
          <motion.a
            key="fab"
            href={WA}
            target="_blank"
            rel="noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="fixed bottom-7 right-7 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-crimson text-cream shadow-[0_20px_40px_-12px_rgba(142,27,27,0.6)] md:flex"
            aria-label="Order on WhatsApp"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-crimson/40" style={{ animationDuration: "2.4s" }} />
            <WhatsAppIcon className="relative h-7 w-7" />
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}
