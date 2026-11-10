import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Art } from '@/components/Art';
import { Key, Shield, Tag, Truck } from '@/components/Icons';
import { ProductBuy } from '@/components/ProductBuy';
import { ProductCard } from '@/components/ProductCard';
import { getProduct, getProducts, isDemo } from '@/lib/catalog';
import { getCategory } from '@/lib/categories';

// Re-fetch catalogue from Shopify at most every 5 minutes (no-op in demo mode).
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const p = await getProduct((await params).handle);
  return { title: p?.title ?? 'Product', description: p?.description.slice(0, 155) };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const cat = getCategory(product.category);
  const related = (await getProducts()).filter((p) => p.category === product.category && p.handle !== product.handle).slice(0, 4);
  const licence = product.kind === 'licence';

  return (
    <>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="crumbs crumbs--light">
            <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {cat && <><Link href={`/shop/${cat.handle}`}>{cat.title}</Link> / </>}<span>{product.title}</span>
          </div>
          <div className="pdp">
            <div className="pdp__media">
              {product.image
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Art art={cat?.art ?? 'marker'} seed={product.handle} label={product.title} />}
            </div>
            <div>
              <span className="pdp__sku">Part no. {product.sku}</span>
              <h1>{product.title}</h1>
              {product.subtitle && <p style={{ color: 'var(--accent)', fontWeight: 600, marginTop: -4 }}>{product.subtitle}</p>}
              {isDemo && product.needsReview && <div className="review-flag"><strong>Data to review:</strong> {product.reviewNote}</div>}
              <ProductBuy product={product} />
              <div className="panel">
                <h3>Description</h3>
                <p className="pdp__desc" style={{ margin: 0 }}>{product.description}</p>
                {product.features && (
                  <ul className="perks">{product.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
                )}
              </div>
              <ul className="perks">
                {licence ? (
                  <>
                    <li><Key /> Licence details emailed on order confirmation</li>
                    <li><Tag /> Seat-based volume pricing — save up to 20%</li>
                  </>
                ) : (
                  <>
                    <li><Truck /> Typically dispatched within 5 working days</li>
                    <li><Tag /> Volume pricing applied automatically</li>
                  </>
                )}
                <li><Shield /> Secure checkout — tax calculated for your state or country</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head"><h2>More in {cat?.title}</h2><Link href={`/shop/${product.category}`} className="link-arrow">View all →</Link></div>
            <div className="grid grid--4">{related.map((p) => <ProductCard key={p.handle} product={p} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
