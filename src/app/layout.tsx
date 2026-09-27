import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Citta Comida — Food For Your Mind & Soul",
  description:
    "Mumbai's cloud bakery for healthier bakes. No refined sugar, no refined flour, eggless — with vegan, gluten-free and keto options. Cakes, breads, cookies and more, delivered across Mumbai, Thane & Navi Mumbai.",
  openGraph: {
    title: "Citta Comida — Healthier Bakes, Mumbai",
    description: "No refined sugar. No refined flour. Eggless. Food for your mind & soul.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
