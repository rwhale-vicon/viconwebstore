import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/catalog';
import { MINIMUM_ORDER, unitPrice } from '@/lib/pricing';
import { createCheckout, shopifyEnabled } from '@/lib/shopify';
import type { Currency } from '@/lib/types';

type Body = { currency: Currency; lines: { handle: string; variantId: string; quantity: number }[] };

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const currency: Currency = body.currency === 'GBP' ? 'GBP' : 'USD';
  const products = await getProducts();

  // Re-price server-side so the minimum order can't be bypassed from the browser.
  let subtotal = 0;
  const lines: { merchandiseId: string; quantity: number }[] = [];
  for (const l of body.lines ?? []) {
    const p = products.find((x) => x.handle === l.handle);
    const v = p?.variants.find((x) => x.id === l.variantId);
    const base = v?.price[currency];
    if (!p || !v || base == null || l.quantity < 1) {
      return NextResponse.json({ error: `“${p?.title ?? l.handle}” can’t be bought online in ${currency}.` }, { status: 400 });
    }
    subtotal += unitPrice(base, p, l.quantity) * l.quantity;
    if (v.shopifyId) lines.push({ merchandiseId: v.shopifyId, quantity: l.quantity });
  }
  if (subtotal < MINIMUM_ORDER[currency]) {
    return NextResponse.json({ error: 'Minimum order value not reached.' }, { status: 400 });
  }

  if (!shopifyEnabled) return NextResponse.json({ demo: true, subtotal });

  // Volume discounts are applied inside Shopify Checkout by the volume-discount app,
  // and the minimum order is enforced there by the checkout-validation app.
  const checkoutUrl = await createCheckout(lines, currency === 'GBP' ? 'GB' : 'US');
  return NextResponse.json({ checkoutUrl });
}
