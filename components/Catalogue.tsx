import Link from 'next/link';
import { getProducts } from '@/lib/catalog';
import { CATEGORIES } from '@/lib/categories';
import { MINIMUM_ORDER } from '@/lib/pricing';
import type { Product } from '@/lib/types';
import { CatalogueGrid } from './CatalogueGrid';
import { ProductCard } from './ProductCard';

export async function Catalogue({ active, products }: { active?: string; products: Product[] }) {
  const all = await getProducts();
  const count = (h: string) => all.filter((p) => p.category === h).length;
  const cards = Object.fromEntries(products.map((p) => [p.handle, <ProductCard key={p.handle} product={p} />]));
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <nav className="cat-chips" aria-label="Categories">
          <Link href="/shop" aria-current={!active ? 'page' : undefined}>All</Link>
          {CATEGORIES.map((c) => <Link key={c.handle} href={`/shop/${c.handle}`} aria-current={active === c.handle ? 'page' : undefined}>{c.title}</Link>)}
        </nav>
        <div className="catalogue">
          <aside className="sidebar">
            <h4>Categories</h4>
            <Link href="/shop" aria-current={!active ? 'page' : undefined}>All products <span>{all.length}</span></Link>
            {CATEGORIES.map((c) => (
              <Link key={c.handle} href={`/shop/${c.handle}`} aria-current={active === c.handle ? 'page' : undefined}>{c.title} <span>{count(c.handle)}</span></Link>
            ))}
            <div className="sidebar__box">
              <strong>Volume pricing</strong>
              Save up to 15% on hardware and 20% on licences — applied automatically in your cart.
            </div>
            <div className="sidebar__box" style={{ marginTop: 12 }}>
              <strong>Minimum order</strong>
              ${MINIMUM_ORDER.USD} / £{MINIMUM_ORDER.GBP} before tax and shipping.
            </div>
          </aside>
          <div><CatalogueGrid products={products} cards={cards} /></div>
        </div>
      </div>
    </section>
  );
}
