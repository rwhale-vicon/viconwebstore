'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { Art } from './Art';
import { CartIcon, ChevronDown, Close, External, Menu } from './Icons';
import { Logo } from './Logo';
import { useStore } from './StoreProvider';

const VICON_COM = 'https://www.vicon.com';

export function Header({ demo }: { demo: boolean }) {
  const { count, currency, setCurrency, ready } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const dd = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); setMobile(false); }, [pathname]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (dd.current && !dd.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setMobile(false); } };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  const current = (href: string) => (pathname === href ? 'page' : undefined);

  return (
    <>
      {demo && <div className="demo-bar">Preview build — demo catalogue and simulated checkout. Prices marked for review are placeholders.</div>}
      <header className="header">
        <div className="container header__inner">
          <Link href="/" className="logo" aria-label="Vicon Store home">
            <Logo />
            <span className="logo__store">Store</span>
          </Link>

          <nav className="nav" aria-label="Main">
            <Link href="/" className="nav__link" aria-current={current('/')}>Home</Link>
            <div className="nav__dropdown" ref={dd} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
              <button className="nav__trigger" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
                Shop By Category <ChevronDown />
              </button>
              {open && (
                <div className="nav__menu" role="menu">
                  {CATEGORIES.map((c) => (
                    <Link key={c.handle} href={`/shop/${c.handle}`} role="menuitem">
                      <div className="mini-art"><Art art={c.art} seed={c.handle} /></div>
                      <div><strong>{c.title}</strong><span>{c.short}</span></div>
                    </Link>
                  ))}
                  <Link href="/shop" className="all" role="menuitem">Browse all products →</Link>
                </div>
              )}
            </div>
            <Link href="/about" className="nav__link" aria-current={current('/about')}>About Vicon</Link>
            <Link href="/how-it-works" className="nav__link" aria-current={current('/how-it-works')}>How It Works</Link>
            <Link href="/contact" className="nav__link" aria-current={current('/contact')}>Get In Touch</Link>
            <a href={VICON_COM} className="nav__link nav__external">Back to Vicon.com <External /></a>
          </nav>

          <div className="header__actions">
            <div className="currency" role="group" aria-label="Currency">
              {(['USD', 'GBP'] as const).map((c) => (
                <button key={c} aria-pressed={currency === c} onClick={() => setCurrency(c)}>{c === 'USD' ? '$ USD' : '£ GBP'}</button>
              ))}
            </div>
            <Link href="/cart" className="cart-btn" aria-label={`Cart, ${count} items`}>
              <CartIcon />
              {ready && count > 0 && <span className="cart-btn__count">{count}</span>}
            </Link>
            <button className="burger" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} onClick={() => setMobile((m) => !m)}>
              {mobile ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="mobile-nav" aria-label="Mobile">
            <Link href="/">Home</Link>
            <details>
              <summary>Shop By Category</summary>
              {CATEGORIES.map((c) => <Link key={c.handle} href={`/shop/${c.handle}`}>{c.title}</Link>)}
              <Link href="/shop">All products</Link>
            </details>
            <Link href="/about">About Vicon</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/contact">Get In Touch</Link>
            <a href={VICON_COM}>Back to Vicon.com ↗</a>
          </nav>
        )}
      </header>
    </>
  );
}
