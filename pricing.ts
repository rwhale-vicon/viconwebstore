import pricing from '@/data/pricing.json';
import type { Currency, Product } from './types';

export type Tier = { min: number; discount: number };

export const MINIMUM_ORDER: Record<Currency, number> = pricing.minimumOrder as Record<Currency, number>;

export function tiersFor(product: Pick<Product, 'kind'>): Tier[] {
  return (pricing.tiers as Record<string, Tier[]>)[product.kind] ?? [{ min: 1, discount: 0 }];
}

export function tierFor(product: Pick<Product, 'kind'>, qty: number): Tier {
  const tiers = tiersFor(product);
  return [...tiers].reverse().find((t) => qty >= t.min) ?? tiers[0];
}

export function unitPrice(base: number, product: Pick<Product, 'kind'>, qty: number) {
  const t = tierFor(product, qty);
  return Math.round(base * (1 - t.discount) * 100) / 100;
}

export function nextTier(product: Pick<Product, 'kind'>, qty: number): Tier | undefined {
  return tiersFor(product).find((t) => t.min > qty);
}

export function formatMoney(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-US', {
    style: 'currency', currency,
    minimumFractionDigits: Number.isInteger(amount) && amount >= 100 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function tierLabel(tiers: Tier[], i: number, unit = 'units') {
  const t = tiers[i];
  const next = tiers[i + 1];
  return next ? `${t.min}–${next.min - 1} ${unit}` : `${t.min}+ ${unit}`;
}
