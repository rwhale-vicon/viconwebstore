import Link from 'next/link';
import { Catalogue } from '@/components/Catalogue';
import { getProducts } from '@/lib/catalog';

// Re-fetch catalogue from Shopify at most every 5 minutes (no-op in demo mode).
export const revalidate = 300;

export const metadata = { title: 'Shop all products' };

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">Home</Link> / <span>Shop</span></div>
          <h1>Shop all products</h1>
          <p>Markers, suits, accessory kits and software licences for Vicon motion capture systems.</p>
        </div>
      </section>
      <Catalogue products={products} />
    </>
  );
}
