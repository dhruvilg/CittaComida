# Citta Comida — website

Next.js 16 · Tailwind 4 · Framer Motion · GSAP ScrollTrigger · Lenis smooth scroll.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live
- `src/data/products.ts` — every product (name, copy, price, options, tags, images, accent colour). Edit here to add/remove bakes.
- `src/components/ProductShowcase.tsx` — the per-product pinned scroll sections (3D rotate + description reveal).
- `src/components/Hero.tsx` — hero with animated hibiscus, word reveal, parallax cards.
- `src/app/globals.css` — brand tokens (crimson from the logo, cream, cocoa, gold) and fonts (Fraunces + Jost).

Product photos currently load from the existing Shopify CDN. To self-host, drop images into `public/products/` and change the `image` paths in `products.ts`.
