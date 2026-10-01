export const SITE = {
  name: "VELORA",
  tagline: "Objects of Quiet Distinction",
  description:
    "VELORA is a European jewellery house creating handmade objects of quiet distinction — refined cuffs and statement pieces made to be remembered.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_GB",
  email: "care@velora.example",
  social: { instagram: "https://www.instagram.com/" },
};

export const NAV = [
  { label: "New", href: "/collections/new-arrivals" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections/bracelets" },
  { label: "Our World", href: "/our-world" },
] as const;

export const FOOTER_NAV = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "All Jewellery", href: "/shop" },
      { label: "Collections", href: "/collections/bracelets" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our World", href: "/our-world" },
      { label: "Craftsmanship", href: "/our-world#craft" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { label: "Contact", href: "/client-care/contact" },
      { label: "Shipping", href: "/client-care/shipping" },
      { label: "Returns", href: "/client-care/returns" },
      { label: "FAQ", href: "/client-care/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
    ],
  },
] as const;
