/**
 * Shopify Storefront API adapter.
 * Active only when SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN are set;
 * otherwise the store runs in demo mode from data/*.json.
 *
 * Conventions expected in Shopify (created by scripts/build-shopify-csv.mjs):
 *  - Each storefront category is a Shopify collection with the same handle.
 *  - Product handles match data/products.json handles.
 *  - Licence products have variants titled "Annual subscription" / "Monthly subscription".
 */
import type { Product } from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || '2025-10';

export const shopifyEnabled = Boolean(domain && token);

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!shopifyEnabled) throw new Error('Shopify is not configured');
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token as string,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

const PRODUCT_FIELDS = `
  handle title description productType
  sku: metafield(namespace: "custom", key: "sku") { value }
  collections(first: 1) { nodes { handle } }
  featuredImage { url }
  usd: variants(first: 10) { nodes { id title price { amount currencyCode } } }
`;

type SfProduct = {
  handle: string; title: string; description: string; productType: string;
  sku: { value: string } | null;
  collections: { nodes: { handle: string }[] };
  featuredImage: { url: string } | null;
  usd: { nodes: { id: string; title: string; price: { amount: string; currencyCode: string } }[] };
};

function mapProduct(p: SfProduct, gbp?: SfProduct): Product {
  const isLicence = p.productType?.toLowerCase().includes('licen');
  return {
    handle: p.handle,
    sku: p.sku?.value ?? '',
    title: p.title,
    description: p.description,
    category: p.collections.nodes[0]?.handle ?? 'kits',
    productType: p.productType,
    kind: isLicence ? 'licence' : 'hardware',
    image: p.featuredImage?.url,
    variants: p.usd.nodes.map((v, i) => ({
      id: v.title === 'Default Title' ? 'default' : v.title.toLowerCase().startsWith('month') ? 'monthly' : v.title.toLowerCase().startsWith('annual') ? 'annual' : v.id,
      label: v.title === 'Default Title' ? 'Standard' : v.title,
      interval: v.title.toLowerCase().startsWith('month') ? 'month' : v.title.toLowerCase().startsWith('annual') ? 'year' : undefined,
      shopifyId: v.id,
      price: {
        USD: Number(v.price.amount),
        GBP: gbp ? Number(gbp.usd.nodes[i]?.price.amount ?? 0) || null : null,
      },
    })),
  };
}

/** Fetch every product once in USD and once in GBP (Shopify Markets contextual pricing). */
export async function fetchAllProducts(): Promise<Product[]> {
  const q = (country: string) => `query All($cursor: String) @inContext(country: ${country}) {
    products(first: 250, after: $cursor) { nodes { ${PRODUCT_FIELDS} } }
  }`;
  const [us, gb] = await Promise.all([
    storefront<{ products: { nodes: SfProduct[] } }>(q('US')),
    storefront<{ products: { nodes: SfProduct[] } }>(q('GB')),
  ]);
  const gbByHandle = new Map(gb.products.nodes.map((p) => [p.handle, p]));
  return us.products.nodes.map((p) => mapProduct(p, gbByHandle.get(p.handle)));
}

/** Create a Shopify cart and return its hosted checkout URL. Taxes, shipping and payment are handled by Shopify Checkout. */
export async function createCheckout(lines: { merchandiseId: string; quantity: number }[], country: 'US' | 'GB') {
  const data = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(
    `mutation Create($lines: [CartLineInput!]!) @inContext(country: ${country}) {
      cartCreate(input: { lines: $lines }) { cart { checkoutUrl } userErrors { message } }
    }`,
    { lines },
  );
  if (!data.cartCreate.cart) throw new Error(data.cartCreate.userErrors.map((e) => e.message).join('; '));
  return data.cartCreate.cart.checkoutUrl;
}
