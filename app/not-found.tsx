import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="section"><div className="container empty">
      <h1>Page not found</h1>
      <p style={{ color: 'var(--ink-soft)' }}>The page you’re looking for has moved or doesn’t exist.</p>
      <Link href="/shop" className="btn btn--primary">Browse the store</Link>
    </div></section>
  );
}
