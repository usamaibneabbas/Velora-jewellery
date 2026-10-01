/**
 * Normalised commerce types.
 *
 * Every component consumes these shapes — never raw data and never a
 * vendor-specific response. When Shopify becomes the backend, map Storefront
 * API responses into these types inside src/commerce/providers/*.
 */

export type CurrencyCode = "USD" | "EUR";

export interface Money {
  amount: number;
  currencyCode: CurrencyCode;
}

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position used when the image is cropped by its frame. */
  focal?: string;
  /** Marks generated placeholders so the UI can label them during development. */
  placeholder?: boolean;
}

export type CategorySlug = "bracelets" | "necklaces" | "rings" | "earrings";

export interface Product {
  id: string;
  /** Stock keeping unit — stable across data sources. */
  sku: string;
  title: string;
  slug: string;
  /** Short editorial line used on cards and in the horizontal collection. */
  tagline: string;
  description: string;
  price: Money;
  category: CategorySlug;
  material: string;
  details: string[];
  care: string[];
  images: ProductImage[];
  featuredImage: ProductImage;
  /** Optional secondary image used for hover swaps on cards. */
  hoverImage?: ProductImage;
  isNew: boolean;
  featured: boolean;
  availableForSale: boolean;
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
}

export interface CartLine {
  /** Merchandise id (product or variant). */
  id: string;
  slug: string;
  title: string;
  material: string;
  price: Money;
  image: ProductImage;
  quantity: number;
}
