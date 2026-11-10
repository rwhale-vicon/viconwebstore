export type Currency = 'GBP' | 'USD';
export type Money = Record<Currency, number | null>;

export type Variant = {
  id: string;
  label: string;
  interval?: 'month' | 'year';
  price: Money;
  /** Shopify ProductVariant GID when running against Shopify */
  shopifyId?: string;
};

export type Product = {
  handle: string;
  sku: string;
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  category: string;
  productType?: string;
  kind: 'hardware' | 'licence';
  variants: Variant[];
  image?: string;
  needsReview?: boolean;
  reviewNote?: string | null;
};

export type Category = {
  handle: string;
  title: string;
  short: string;
  blurb: string;
  art: string;
};
