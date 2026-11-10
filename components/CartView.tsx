'use client';
import Link from 'next/link';
import { useState } from 'react';
import { getCategory } from '@/lib/categories';
import { formatMoney, MINIMUM_ORDER, nextTier, tierFor, unitPrice } from '@/lib/pricing';
import type { Product } from '@/lib/types';
import { Art } from './Art';
import { useStore } from './StoreProvider';

export function CartView({ products }: { products: Product[] }) {
  const { lines, setQty, remove, currency, ready, clear } = useStore();
  const [status, setStatus] = useState<'idle' | 'loading' | 'demo' | 'error'>('idle');
  const [error, setError] = useState('');

  if (!ready) return <div className="empty">Loading your cart…</div>;

  const rows = lines.flatMap((l) => {
    const p = products.find((x) => x.handle === l.handle);
    const v = p?.variants.find((x) => x.id === l.variantId);
    if (!p || !v) return [];
    const base = v.price[currency];
    const unit = base != null ? unitPrice(base, p, l.quantity) : null;
    return [{ l, p, v, base, unit, total: unit != null ? unit * l.quantity : 0, tier: tierFor(p, l.quantity), next: nextTier(p, l.quantity) }];
  });

  const listTotal = rows.reduce((s, r) => s + (r.base ?? 0) * r.l.quantity, 0);
  const subtotal = rows.reduce((s, r) => s + r.total, 0);
  const savings = listTotal - subtotal;
  const min = MINIMUM_ORDER[currency];
  const unavailable = rows.some((r) => r.base == null);
  const meetsMin = subtotal >= min;
  const hasHardware = rows.some((r) => r.p.kind === 'hardware');

  async function checkout() {
    setStatus('loading'); setError('');
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currency, lines }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else setStatus('demo');
    } catch (e) { setError((e as Error).message); setStatus('error'); }
  }

  if (rows.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--ink-soft)' }}>Browse markers, suits, kits and licences to get started.</p>
        <Link href="/shop" className="btn btn--primary" style={{ marginTop: 12 }}>Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div>
        {rows.map(({ l, p, v, base, unit, total, tier, next }) => (
          <div key={`${l.handle}-${l.variantId}`} className="cart-line">
            <Link href={`/products/${p.handle}`} className="cart-line__art"><Art art={getCategory(p.category)?.art ?? 'marker'} seed={p.handle} label={p.title} /></Link>
            <div>
              <Link href={`/products/${p.handle}`} className="cart-line__title">{p.title}</Link>
              <div className="cart-line__meta">{p.sku}{p.kind === 'licence' ? ` · ${v.label}` : ''}{unit != null ? ` · ${formatMoney(unit, currency)} ${p.kind === 'licence' ? 'per seat' : 'each'}` : ''}</div>
              <div className="cart-line__controls">
                <div className="qty qty--sm">
                  <button onClick={() => setQty(l.handle, l.variantId, l.quantity - 1)} aria-label="Decrease">−</button>
                  <input type="number" value={l.quantity} min={1} onChange={(e) => setQty(l.handle, l.variantId, Number(e.target.value) || 1)} aria-label="Quantity" />
                  <button onClick={() => setQty(l.handle, l.variantId, l.quantity + 1)} aria-label="Increase">+</button>
                </div>
                <button className="cart-line__remove" onClick={() => remove(l.handle, l.variantId)}>Remove</button>
              </div>
              {next && base != null && <div className="cart-line__meta" style={{ marginTop: 6, color: '#0b6b63' }}>Add {next.min - l.quantity} more to save {Math.round(next.discount * 100)}%</div>}
            </div>
            <div className="cart-line__price">
              {base == null ? <span style={{ fontSize: '.85rem', color: '#b42318' }}>Not available in {currency}</span> : formatMoney(total, currency)}
              {tier.discount > 0 && base != null && <small>{Math.round(tier.discount * 100)}% volume discount</small>}
            </div>
          </div>
        ))}
        <button className="cart-line__remove" style={{ marginTop: 16 }} onClick={clear}>Clear cart</button>
      </div>

      <aside className="summary">
        <h2>Order summary</h2>
        <div className="summary__row"><span>List price</span><span>{formatMoney(listTotal, currency)}</span></div>
        {savings > 0.005 && <div className="summary__row save"><span>Volume savings</span><span>−{formatMoney(savings, currency)}</span></div>}
        <div className="summary__row"><span>Shipping</span><span>{hasHardware ? 'Calculated at checkout' : 'Not required'}</span></div>
        <div className="summary__row"><span>Tax</span><span>Calculated at checkout</span></div>
        <div className="summary__row summary__row--total"><span>Subtotal</span><span>{formatMoney(subtotal, currency)}</span></div>

        <div className="mov">
          <div className="mov__bar"><span style={{ width: `${Math.min(100, (subtotal / min) * 100)}%` }} /></div>
          <p>{meetsMin ? `✓ Minimum order of ${formatMoney(min, currency)} reached` : `Add ${formatMoney(min - subtotal, currency)} more to reach the ${formatMoney(min, currency)} minimum order.`}</p>
        </div>

        <button className="btn btn--primary btn--block" disabled={!meetsMin || unavailable || status === 'loading'} onClick={checkout}>
          {status === 'loading' ? 'Preparing checkout…' : 'Proceed to secure checkout'}
        </button>
        {unavailable && <p className="form__note" style={{ marginTop: 10, color: '#b42318' }}>Some items aren’t available to buy online in {currency}. Remove them or <Link href="/contact?topic=quote" style={{ textDecoration: 'underline' }}>request a quote</Link>.</p>}
        {status === 'error' && <p className="form__note" style={{ marginTop: 10, color: '#b42318' }}>{error}</p>}
        {status === 'demo' && (
          <div className="review-flag" style={{ marginTop: 14, marginBottom: 0 }}>
            <strong>Demo mode:</strong> in the live store this button creates a Shopify cart and redirects to Shopify Checkout, where state sales tax, shipping and payment are handled.
          </div>
        )}
        <p className="form__note" style={{ marginTop: 14 }}>Need to pay by purchase order? <Link href="/contact?topic=quote" style={{ textDecoration: 'underline' }}>Request a quote</Link>.</p>
      </aside>
    </div>
  );
}
