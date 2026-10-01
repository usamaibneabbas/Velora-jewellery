import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { getProducts } from "@/commerce/products";
import { formatMoney } from "@/commerce/pricing";
import { JsonLd } from "@/components/JsonLd";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Loader } from "@/components/layout/Loader";
import { PageTransitionProvider } from "@/components/layout/PageTransition";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: "/products/product-02/portrait.webp", width: 1122, height: 1402, alt: "VELORA Étoile cuffs on stone" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/products/product-02/portrait.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1b1611",
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: enables JS-only initial states and skips the loader for returning visitors.
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('velora.seen'))d.classList.add('velora-seen')}catch(e){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const products = await getProducts();
  const searchItems = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    material: p.material,
    price: formatMoney(p.price),
    image: { src: p.featuredImage.src, alt: p.featuredImage.alt },
  }));

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <noscript>
          <style>{`.velora-loader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <PageTransitionProvider>
          <SmoothScroll />
          <Loader />
          <Header searchItems={searchItems} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Cursor />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
