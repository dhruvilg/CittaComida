"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hibiscus from "./Hibiscus";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("lenis-stopped");
    const t = setTimeout(() => {
      setDone(true);
      document.documentElement.classList.remove("lenis-stopped");
    }, 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-crimson text-cream"
        >
          <Hibiscus className="h-40 w-40 md:h-56 md:w-56" delay={0.1} strokeWidth={2.4} />
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mt-6 text-xs font-medium uppercase"
          >
            Citta Comida
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="font-display-italic mt-2 text-lg"
          >
            Food for your mind &amp; soul
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
