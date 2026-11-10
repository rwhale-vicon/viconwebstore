'use client';
import Link from 'next/link';
import { useState } from 'react';
import { formatMoney } from '@/lib/pricing';
import type { Product } from '@/lib/types';
import { useStore } from './StoreProvider';

export function LicenceSection({ licences }: { licences: Product[] }) {
  const { currency } = useStore();
  const [term, setTerm] = useState<'annual' | 'monthly'>('annual');
  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <div className="licence-toggle" role="group" aria-label="Billing term">
          <button aria-pressed={term === 'annual'} onClick={() => setTerm('annual')}>Annual</button>
          <button aria-pressed={term === 'monthly'} onClick={() => setTerm('monthly')}>Monthly</button>
        </div>
      </div>
      <div className="grid grid--4">
        {licences.map((l) => {
          const v = l.variants.find((x) => x.id === term) ?? l.variants[0];
          const p = v.price[currency];
          return (
            <div key={l.handle} className="licence-card">
              <h3>{l.title}</h3>
              <div className="licence-card__sub">{l.subtitle}</div>
              <p style={{ fontSize: '.9rem', margin: 0 }}>{l.description}</p>
              <div className="licence-card__price">
                {p != null ? formatMoney(p, currency) : 'POA'} <span>/ seat / {v.interval}</span>
              </div>
              <ul>{l.features?.map((f) => <li key={f}>{f}</li>)}</ul>
              <Link href={`/products/${l.handle}`} className="btn btn--primary btn--block">Buy licence</Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
