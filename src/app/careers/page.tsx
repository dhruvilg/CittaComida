import type { Metadata } from "next";
import Link from "next/link";
import Careers from "@/components/Careers";
import Hibiscus from "@/components/Hibiscus";

export const metadata: Metadata = {
  title: "Careers — Citta Comida",
  description:
    "Join Citta Comida, a women-led healthier bakery in Andheri, Mumbai. Hiring bakers, pastry chefs, kitchen helpers and delivery/dispatch staff. Apply in 1 minute on WhatsApp.",
  openGraph: {
    title: "We're hiring — Citta Comida, Mumbai",
    description: "Bakers, pastry chefs, kitchen helpers, delivery & dispatch. Apply in 1 minute on WhatsApp.",
    type: "website",
  },
};

export default function CareersPage() {
  return (
    <main className="relative min-h-[100svh] bg-paper">
      <header className="fixed inset-x-0 top-0 z-50 bg-paper/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 text-crimson">
            <Hibiscus className="h-9 w-9" draw={false} strokeWidth={5} />
            <span className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.22em] md:text-[15px] md:tracking-[0.32em]">Citta Comida</span>
          </Link>
          <Link
            href="/"
            className="whitespace-nowrap rounded-full border border-cocoa/15 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] md:px-4 md:text-[11px] md:tracking-[0.22em] text-cocoa/70 hover:border-crimson hover:text-crimson"
          >
            Our bakes
          </Link>
        </nav>
      </header>
      <Careers standalone />
    </main>
  );
}
