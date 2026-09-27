"use client";

import Hibiscus from "./Hibiscus";

const items = [
  "No Refined Sugar",
  "No Refined Flour",
  "Eggless Always",
  "Vegan Options",
  "Gluten-Free Options",
  "Keto Friendly",
  "Baked in Small Batches",
  "Delivered Across Mumbai",
];

export default function Marquee({ dark = false }: { dark?: boolean }) {
  const row = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y py-4 md:py-5 ${
        dark ? "border-cream/10 bg-crimson text-cream" : "border-cocoa/10 bg-paper text-cocoa"
      }`}
    >
      <div className="animate-marquee flex w-max items-center whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8">
            <span className="font-display text-xl md:text-3xl">{t}</span>
            <Hibiscus className={`h-6 w-6 ${dark ? "text-gold" : "text-crimson"}`} draw={false} strokeWidth={6} />
          </span>
        ))}
      </div>
    </div>
  );
}
