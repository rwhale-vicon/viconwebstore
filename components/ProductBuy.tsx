'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatMoney, nextTier, tierFor, tierLabel, tiersFor, unitPrice } from '@/lib/pricing';
import type { Product } from '@/lib/types';
import { useStore } from './StoreProvider';

export function ProductBuy({ product }: { product: Product }) {
  const { currency, add } = useStore();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const base = variant.price[currency];
  const tiers = tiersFor(product);
  const active = tierFor(product, qty);
  const upcoming = nextTier(product, qty);
  const unitWord = product.kind === 'licence' ? 'seats' : 'units';
  const per = variant.interval ? ` / seat / ${variant.interval}` : ' each';

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(false), 4000); return () => clearTimeout(t); }, [toast]);

  return (
    <div>
      <div className="pdp__price">
        {base != null ? (
          <>
            {formatMoney(unitPrice(base, product, qty), currency)}
            {active.discount > 0 && <s>{formatMoney(base, currency)}</s>}
            <small>{per}</small>
          </>
        ) : <span style={{ fontSize: '1.3rem' }}>Price on request in {currency}</span>}
      </div>
      <p className="pdp__tax">
        {product.kind === 'licence' ? 'Excludes applicable sales tax/VAT. Delivered digitally — no shipping.' : 'Excludes tax and shipping — calculated at checkout for your state or country.'}
      </p>

      {product.variants.length > 1 && (
        <fieldset className="variant-picker" style={{ border: 0, padding: 0 }}>
          <legend className="sr-only">Billing term</legend>
          {product.variants.map((v) => (
            <label key={v.id}>
              <span><input type="radio" name="variant" value={v.id} checked={v.id === variantId} onChange={() => setVariantId(v.id)} />{v.label}</span>
              <strong>{v.price[currency] != null ? `${formatMoney(v.price[currency]!, currency)} / ${v.interval}` : '—'}</strong>
            </label>
          ))}
        </fieldset>
      )}

      {upcoming && base != null && (
        <p className="nudge">Add {upcoming.min - qty} more {unitWord} to save {Math.round(upcoming.discount * 100)}% on every {product.kind === 'licence' ? 'seat' : 'unit'}.</p>
      )}

      <div className="buy-row">
        <div className="qty" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <input type="number" min={1} max={999} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))} aria-label="Quantity" />
          <button type="button" onClick={() => setQty((q) => Math.min(999, q + 1))} aria-label="Increase quantity">+</button>
        </div>
        <button className="btn btn--primary" disabled={base == null} onClick={() => { add({ handle: product.handle, variantId: variant.id, quantity: qty }); setToast(true); }}>
          {base == null ? 'Contact us to order' : `Add ${qty} to cart${base != null ? ` — ${formatMoney(unitPrice(base, product, qty) * qty, currency)}` : ''}`}
        </button>
      </div>
      {base == null && <Link href={`/contact?product=${encodeURIComponent(product.sku)}`} className="link-arrow">Request a quote for this item →</Link>}

      {base != null && tiers.length > 1 && (
        <div className="panel">
          <h3>Volume pricing</h3>
          <table className="tier-table">
            <thead><tr><th>Quantity</th><th>Discount</th><th>{product.kind === 'licence' ? 'Per seat' : 'Per unit'}</th></tr></thead>
            <tbody>
              {tiers.map((t, i) => (
                <tr key={t.min} className={t.min === active.min ? 'is-active' : ''}>
                  <td>{tierLabel(tiers, i, unitWord)}</td>
                  <td>{t.discount ? <span className="save">{Math.round(t.discount * 100)}% off</span> : '—'}</td>
                  <td>{formatMoney(unitPrice(base, product, t.min), currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          Added {qty} × {product.title}
          <Link href="/cart">View cart →</Link>
        </div>
      )}
    </div>
  );
}
