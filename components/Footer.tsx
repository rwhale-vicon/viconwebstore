import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <h4>Vicon Store</h4>
            <p style={{ maxWidth: 320 }}>Genuine Vicon markers, suits, accessories and software licences — shipped from the people who have been capturing motion since 1984.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>{CATEGORIES.slice(0, 6).map((c) => <li key={c.handle}><Link href={`/shop/${c.handle}`}>{c.title}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Store</h4>
            <ul>
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/#faqs">FAQs</Link></li>
              <li><Link href="/shop/software-licences">Software licences</Link></li>
              <li><Link href="/contact?topic=custom">Custom systems</Link></li>
              <li><Link href="/cart">Your cart</Link></li>
            </ul>
          </div>
          <div>
            <h4>Vicon</h4>
            <ul>
              <li><Link href="/about">About Vicon</Link></li>
              <li><Link href="/contact">Get in touch</Link></li>
              <li><a href="https://www.vicon.com">Vicon.com</a></li>
              <li><a href="https://help.vicon.com">Documentation</a></li>
              <li><a href="https://www.vicon.com/support/">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Vicon Motion Systems Ltd. UK registered no. 1801446</span>
          <span>All specifications subject to change without notice.</span>
        </div>
      </div>
    </footer>
  );
}
