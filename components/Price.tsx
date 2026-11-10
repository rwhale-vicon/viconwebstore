'use client';
import { formatMoney } from '@/lib/pricing';
import type { Money } from '@/lib/types';
import { useStore } from './StoreProvider';

export function Price({ money, multiplier = 1, fallback = 'Price on request' }: { money: Money; multiplier?: number; fallback?: string }) {
  const { currency } = useStore();
  const v = money[currency];
  if (v == null) return <>{fallback}</>;
  return <>{formatMoney(v * multiplier, currency)}</>;
}

export function MoneyText({ amount }: { amount: Money }) {
  return <Price money={amount} />;
}
