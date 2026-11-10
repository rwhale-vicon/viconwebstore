import 'server-only';
import productsJson from '@/data/products.json';
import licencesJson from '@/data/licenses.json';
import type { Product } from './types';
import { fetchAllProducts, shopifyEnabled } from './shopify';

type RawHardware = Omit<Product, 'variants'> & { price: Product['variants'][number]['price'] };

const demoProducts: Product[] = [
  ...(licencesJson as Product[]),
  ...(productsJson as RawHardware[]).map(({ price, ...p }) => ({
    ...p,
    kind: 'hardware' as const,
    variants: [{ id: 'default', label: 'Standard', price }],
  })),
];

export const isDemo = !shopifyEnabled;

export async function getProducts(): Promise<Product[]> {
  if (shopifyEnabled) {
    try {
      return await fetchAllProducts();
    } catch (e) {
      console.error('Shopify fetch failed, falling back to demo data', e);
    }
  }
  return demoProducts;
}

export async function getProduct(handle: string) {
  return (await getProducts()).find((p) => p.handle === handle);
}

export async function getProductsByCategory(category: string) {
  return (await getProducts()).filter((p) => p.category === category);
}

export async function getProductsByHandles(handles: string[]) {
  const all = await getProducts();
  return handles.map((h) => all.find((p) => p.handle === h)).filter(Boolean) as Product[];
}
