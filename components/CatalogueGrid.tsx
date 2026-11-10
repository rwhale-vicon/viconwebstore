'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { useStore } from './StoreProvider';

export function CatalogueGrid({ products, cards }: { products: Product[]; cards: Record<string, React.ReactNode> }) {
  const { currency } = useStore();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let r = products.filter((p) => !term || `${p.title} ${p.sku} ${p.description}`.toLowerCase().includes(term));
    const price = (p: Product) => p.variants[0].price[currency] ?? Number.POSITIVE_INFINITY;
    if (sort === 'price-asc') r = [...r].sort((a, b) => price(a) - price(b));
    if (sort === 'price-desc') r = [...r].sort((a, b) => (price(b) === Infinity ? -1 : price(b)) - (price(a) === Infinity ? -1 : price(a)));
    if (sort === 'name') r = [...r].sort((a, b) => a.title.localeCompare(b.title));
    return r;
  }, [products, q, sort, currency]);

  return (
    <>
      <div className="toolbar">
        <input type="search" placeholder="Search by name or part number" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="result-count">{list.length} products</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>
      <div className="grid grid--products">{list.map((p) => <div key={p.handle} style={{ display: 'contents' }}>{cards[p.handle]}</div>)}</div>
      {list.length === 0 && <p className="empty">No products match “{q}”.</p>}
    </>
  );
}
