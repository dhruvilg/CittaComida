"use client";

import { motion } from "framer-motion";

/**
 * Line-art hibiscus inspired by the Citta Comida mark.
 * `draw` animates the strokes on; `spin` slowly rotates it.
 */
export default function Hibiscus({
  className = "",
  draw = true,
  delay = 0,
  strokeWidth = 2.2,
}: {
  className?: string;
  draw?: boolean;
  delay?: number;
  strokeWidth?: number;
}) {
  const petal = (d: string, i: number) => (
    <motion.path
      key={i}
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={draw ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.6, delay: delay + i * 0.18, ease: [0.65, 0, 0.35, 1] }}
    />
  );

  const petals = [
    // top petal
    "M100 108 C 92 84, 88 56, 104 42 C 116 32, 128 40, 126 56 C 124 44, 140 40, 146 52 C 152 66, 128 92, 100 108 Z",
    // upper-right petal
    "M100 108 C 122 88, 150 80, 168 92 C 182 102, 176 118, 160 118 C 176 120, 178 136, 164 140 C 146 146, 118 128, 100 108 Z",
    // lower-right petal
    "M100 108 C 122 116, 142 138, 140 160 C 138 174, 122 176, 116 164 C 120 178, 106 186, 96 176 C 84 162, 88 132, 100 108 Z",
    // lower-left petal
    "M100 108 C 80 122, 52 130, 36 118 C 24 108, 30 92, 46 92 C 30 90, 30 74, 44 72 C 62 68, 86 88, 100 108 Z",
    // upper-left petal
    "M100 108 C 76 104, 56 84, 60 62 C 62 48, 78 46, 84 58 C 80 44, 96 36, 104 48 C 112 62, 108 90, 100 108 Z",
  ];

  const veins = [
    "M100 108 L 112 70",
    "M100 108 L 140 100",
    "M100 108 L 122 148",
    "M100 108 L 60 112",
    "M100 108 L 76 74",
  ];

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {petals.map(petal)}
      {veins.map((d, i) => (
        <motion.path
          key={`v${i}`}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
          initial={draw ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.9, delay: delay + 0.9 + i * 0.08 }}
        />
      ))}
      {/* stamen */}
      <motion.path
        d="M100 108 C 120 84, 140 60, 162 34"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth * 1.3}
        strokeLinecap="round"
        initial={draw ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay: delay + 1.2, ease: "easeOut" }}
      />
      {[
        [164, 30, 3.2],
        [170, 24, 2.6],
        [158, 26, 2.2],
        [172, 32, 2],
        [166, 20, 1.8],
        [160, 34, 1.6],
        [176, 28, 1.5],
      ].map(([cx, cy, r], i) => (
        <motion.circle
          key={`s${i}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="currentColor"
          initial={draw ? { scale: 0, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: delay + 2.1 + i * 0.06, type: "spring" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
    </svg>
  );
}
