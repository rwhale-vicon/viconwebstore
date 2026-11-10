import { CartView } from '@/components/CartView';
import { getProducts } from '@/lib/catalog';

// Re-fetch catalogue from Shopify at most every 5 minutes (no-op in demo mode).
export const revalidate = 300;

export const metadata = { title: 'Your cart' };

export default async function CartPage() {
  const products = await getProducts();
  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="container">
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>Your cart</h1>
        <CartView products={products} />
      </div>
    </section>
  );
}
