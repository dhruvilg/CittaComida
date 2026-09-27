"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const v: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-12% 0px" }}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const wordVariants: Variants = {
  hidden: { y: "110%", rotate: 2 },
  show: (i: number) => ({
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Word-by-word masked reveal. The observer sits on the (unclipped) parent
 * so clipped children still animate in.
 */
export function SplitLines({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span className="inline-block" variants={wordVariants} custom={i}>
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
