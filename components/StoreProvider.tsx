'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Currency } from '@/lib/types';

export type CartLine = {
  handle: string;
  variantId: string;
  quantity: number;
};

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  lines: CartLine[];
  count: number;
  add: (line: CartLine) => void;
  setQty: (handle: string, variantId: string, qty: number) => void;
  remove: (handle: string, variantId: string) => void;
  clear: () => void;
  ready: boolean;
};

const StoreContext = createContext<Ctx | null>(null);
const KEY = 'vicon-store:v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (saved.currency === 'GBP' || saved.currency === 'USD') setCurrency(saved.currency);
      if (Array.isArray(saved.lines)) setLines(saved.lines);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ currency, lines })); } catch {}
  }, [currency, lines, ready]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.handle === line.handle && l.variantId === line.variantId);
      if (i === -1) return [...prev, line];
      const next = [...prev];
      next[i] = { ...next[i], quantity: next[i].quantity + line.quantity };
      return next;
    });
  }, []);

  const setQty = useCallback((handle: string, variantId: string, qty: number) => {
    setLines((prev) => prev
      .map((l) => (l.handle === handle && l.variantId === variantId ? { ...l, quantity: Math.max(0, Math.min(999, qty)) } : l))
      .filter((l) => l.quantity > 0));
  }, []);

  const remove = useCallback((handle: string, variantId: string) => {
    setLines((prev) => prev.filter((l) => !(l.handle === handle && l.variantId === variantId)));
  }, []);

  const value = useMemo<Ctx>(() => ({
    currency, setCurrency, lines, add, setQty, remove, ready,
    clear: () => setLines([]),
    count: lines.reduce((n, l) => n + l.quantity, 0),
  }), [currency, lines, add, setQty, remove, ready]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
