# VELORA — Objects of Quiet Distinction

A cinematic, scroll-driven storefront for VELORA jewellery.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Lenis · Three.js / React Three Fiber.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
npm run images     # re-crop product photography from /assets/originals
```

## Replacing / adding product photography

1. Put originals in `assets/originals/` and add crop entries to `scripts/process-images.mjs`
   (or drop finished files straight into `public/products/product-XX/`).
2. Run `npm run images`.
3. Update `images` for that product in `src/commerce/data/products.ts`.
   The first image is the featured image; the second is the hover image on cards.
4. To re-cast which piece appears in each homepage scene, edit `CAST` in `src/app/page.tsx`.

**Brand rule:** product-only photography. No models, hands, faces or mannequins.

Current state:

| SKU | Product | Photography |
| --- | --- | --- |
| VEL-CF-001 | Ailes Cuff | Cropped from the campaign image, with the baked-in text removed |
| VEL-CF-002 | Étoile Cuff | Product still (hero of the 3D showroom texture) |
| VEL-CF-003 | Nuit Cuff (lapis) | **Placeholder.** The only photo supplied shows it on a wrist |
| VEL-XX-004 | Reserved slot | Draft (`published: false`) |

Higher-resolution originals (≥ 2400px on the long edge) will noticeably sharpen the full-screen scenes.

## Architecture

```
src/
  commerce/            Shopify-ready data layer — UI only consumes normalised types
    types.ts           Product, Money, CartLine …
    data/products.ts   the ONLY place catalogue content lives
    products.ts        async getters (swap for Storefront API)
    pricing.ts         Money formatting; USD launch price, EUR-ready
    config.ts          NEXT_PUBLIC_STORE_CURRENCY=EUR switches currency
    cart/              external cart store + useCart hook (localStorage)
    checkout.ts        checkout hand-off (return Shopify checkoutUrl later)
  components/
    layout/            Header, Footer, CartDrawer, SearchOverlay, PageTransition, Loader, Cursor, SmoothScroll
    home/              the 12 homepage scenes
    product/           ProductGallery, ProductInfo, AddToCart, Accordion, ProductStoryScene
    collection/        hero, typographic filter, view
    motion/            RevealText, MaskReveal, ParallaxImage, Magnetic
    three/             ProductScene, CuffModel, LightingRig, FloatingObject
    ui/                Button, ProductCard, Price, icons …
  lib/
    gsap.ts            single plugin registration + MEDIA conditions
    motion.ts          useScene() — useGSAP + matchMedia, auto cleanup
    scroll.ts          Lenis handle (lock / reset)
    seo.ts             JSON-LD builders (Organization, Product, Breadcrumb)
```

### Motion system
Every animated scene uses `useScene(ref, ({ desktop, tablet, mobile, reduce }) => …)`.
It wraps `useGSAP` with `gsap.matchMedia`, so each device class gets its own choreography,
and all timelines and ScrollTriggers are reverted on unmount (no leaks).
`prefers-reduced-motion` gets static layouts with gentle fades. Smooth scroll is turned off.

### 3D
The showroom (scene 07) is a procedural open cuff textured with real VELORA photography.
It is lazy-loaded and renders only while in view. It is skipped on phones, for reduced motion
and without WebGL, which all get a layered 2D fallback.

### Moving to Shopify
Re-implement the functions in `src/commerce/products.ts` with Storefront API queries that map
to the types in `types.ts`. Then replace the mutations in `cart/store.ts` with Storefront cart
mutations and return `cart.checkoutUrl` from `checkout.ts`.

### SEO
Per-page metadata, OpenGraph/Twitter, canonical URLs, `sitemap.xml`, `robots.txt`,
Organization, WebSite, Product and BreadcrumbList JSON-LD.
Set `NEXT_PUBLIC_SITE_URL` in production.

Legal and client-care copy in `src/lib/pages.ts` is a starting point. Have it reviewed before launch.
