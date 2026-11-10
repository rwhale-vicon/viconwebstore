import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Catalogue } from '@/components/Catalogue';
import { getProductsByCategory } from '@/lib/catalog';
import { CATEGORIES, getCategory } from '@/lib/categories';

// Re-fetch catalogue from Shopify at most every 5 minutes (no-op in demo mode).
export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const c = getCategory((await params).category);
  return { title: c?.title ?? 'Shop', description: c?.blurb };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const products = await getProductsByCategory(category);
  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{c.title}</span></div>
          <h1>{c.title}</h1>
          <p>{c.blurb}</p>
        </div>
      </section>
      <Catalogue active={category} products={products} />
    </>
  );
}
