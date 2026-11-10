import Link from 'next/link';
import { Art, HeroFigure } from '@/components/Art';
import { ContactSection } from '@/components/ContactSection';
import { Faq } from '@/components/Faq';
import { ArrowRight, Award, Shield, Tag, Truck } from '@/components/Icons';
import { LicenceSection } from '@/components/LicenceSection';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/catalog';
import { CATEGORIES } from '@/lib/categories';
import { ABOUT_STATS, HOW_STEPS, MARKETS } from '@/lib/content';
import { MINIMUM_ORDER } from '@/lib/pricing';
import type { Product } from '@/lib/types';

// Re-fetch catalogue from Shopify at most every 5 minutes (no-op in demo mode).
export const revalidate = 300;

function Rail({ products }: { products: Product[] }) {
  return <div className="scroller">{products.map((p) => <ProductCard key={p.handle} product={p} />)}</div>;
}

export default async function Home() {
  const products = await getProducts();
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.handle, products.filter((p) => p.category === c.handle).length]));
  const markers = products.filter((p) => p.category === 'markers' && p.variants[0].price.USD && p.variants[0].price.GBP).slice(0, 8);
  const suitsPick = ['mocap-sx-suit-medium', '3x3-pex-suit-kit-male-medium', '3x3-pex-suit-kit-female-medium', 'suit-colour-id-code-blue', 'set-of-fingerless-gloves-specify-size-on-quote-s-m-l-xl', 'mocap-sx-suit-large'];
  const suits = suitsPick.map((h) => products.find((p) => p.handle === h)).filter(Boolean) as Product[];
  const licences = products.filter((p) => p.kind === 'licence');

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <span className="eyebrow" style={{ color: 'var(--accent-2)' }}>The official Vicon Store</span>
            <h1>Everything you need for your <em>capture volume</em></h1>
            <p>Genuine Vicon markers, suits, accessory kits and software licences — with volume pricing built in and fast dispatch from the team that has been capturing motion since 1984.</p>
            <div className="hero__ctas">
              <Link href="/shop" className="btn btn--primary">Shop all products <ArrowRight /></Link>
              <Link href="/shop/software-licences" className="btn btn--ghost">Buy software licences</Link>
            </div>
            <div className="hero__stats">
              <div><strong>80+</strong><span>Accessories in stock</span></div>
              <div><strong>Up to 15%</strong><span>Off with volume pricing</span></div>
              <div><strong>40+ yrs</strong><span>Motion capture expertise</span></div>
            </div>
          </div>
          <div className="hero__visual"><HeroFigure /></div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="trust">
        <div className="container trust__inner">
          <div className="trust__item"><span className="trust__icon"><Award /></span><div><strong>Genuine Vicon</strong>Designed for Vicon systems</div></div>
          <div className="trust__item"><span className="trust__icon"><Tag /></span><div><strong>Volume pricing</strong>Save automatically as you scale</div></div>
          <div className="trust__item"><span className="trust__icon"><Shield /></span><div><strong>Secure checkout</strong>Tax calculated for your state</div></div>
          <div className="trust__item"><span className="trust__icon"><Truck /></span><div><strong>Fast dispatch</strong>Typically within 5 working days</div></div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Shop by category</span>
              <h2>Kit out your capture volume</h2>
              <p className="lede">From 1.5 mm facial markers to full performer suits — find exactly what your system needs.</p>
            </div>
            <Link href="/shop" className="link-arrow">View all products <ArrowRight /></Link>
          </div>
          <div className="grid grid--4">
            {CATEGORIES.map((c) => (
              <Link key={c.handle} href={`/shop/${c.handle}`} className="cat-card">
                <div className="cat-card__art"><Art art={c.art} seed={c.handle} label={c.title} /></div>
                <div className="cat-card__body">
                  <h3>{c.title}</h3>
                  <p>{c.short}</p>
                  <p className="cat-card__count">{counts[c.handle]} products →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop markers */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Shop markers</span>
              <h2>Reflective markers, 1.5 mm to 25.4 mm</h2>
              <p className="lede">Hard, soft and facial markers — threaded, on bases or self-adhesive. Stock up and save with volume pricing.</p>
            </div>
            <Link href="/shop/markers" className="link-arrow">All markers <ArrowRight /></Link>
          </div>
          <Rail products={markers} />
        </div>
      </section>

      {/* Shop suits */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Shop suits</span>
              <h2>Suits & gloves for every performer</h2>
              <p className="lede">Lightweight Mocap SX and professional PEX suit kits in every size, plus gloves, boots and colour ID patches for multi-actor capture.</p>
            </div>
            <Link href="/shop/suits-gloves" className="link-arrow">All suits & gloves <ArrowRight /></Link>
          </div>
          <Rail products={suits} />
        </div>
      </section>

      {/* Shop licences */}
      <section className="section section--dark" id="licences">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Shop licences</span>
              <h2>Vicon software, licensed your way</h2>
              <p className="lede">Annual or monthly subscriptions per seat, delivered digitally. Add more seats and the price per seat drops.</p>
            </div>
            <Link href="/shop/software-licences" className="link-arrow">Compare licences <ArrowRight /></Link>
          </div>
          <LicenceSection licences={licences} />
        </div>
      </section>

      {/* How it works */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>From basket to capture in four steps</h2>
              <p className="lede">Minimum online order {`$${MINIMUM_ORDER.USD} / £${MINIMUM_ORDER.GBP}`}. Volume discounts and tax are calculated for you.</p>
            </div>
            <Link href="/how-it-works" className="link-arrow">Read the full process <ArrowRight /></Link>
          </div>
          <div className="steps">
            {HOW_STEPS.map((s) => <div key={s.title} className="step"><h3>{s.title}</h3><p>{s.text}</p></div>)}
          </div>
        </div>
      </section>

      {/* About Vicon */}
      <section className="section section--dark">
        <div className="container split">
          <div>
            <span className="eyebrow">About Vicon</span>
            <h2>Capturing motion since 1984</h2>
            <p className="lede">Vicon is a global leader in motion capture. Our cameras, software and accessories are trusted by biomechanics labs, VFX studios, game developers, engineers and VR pioneers around the world.</p>
            <div className="pill-list">{MARKETS.map((m) => <span key={m} className="pill">{m}</span>)}</div>
            <Link href="/about" className="btn btn--ghost">More about Vicon <ArrowRight /></Link>
          </div>
          <div className="stat-grid">
            {ABOUT_STATS.map((s) => <div key={s.label} className="stat"><strong>{s.value}</strong><span>{s.label}</span></div>)}
          </div>
        </div>
      </section>

      {/* Custom systems */}
      <section className="section">
        <div className="container">
          <div className="custom">
            <div>
              <span className="eyebrow" style={{ color: 'var(--accent-2)' }}>Custom systems</span>
              <h2>Need a complete motion capture system?</h2>
              <p className="lede">Cameras, software, installation and training — our specialists design systems around your space, subjects and budget. From a 4-camera Vero starter system to stadium-scale volumes.</p>
              <div className="hero__ctas" style={{ marginTop: 24 }}>
                <Link href="/contact?topic=custom" className="btn btn--primary">Speak to the team <ArrowRight /></Link>
                <a href="https://www.vicon.com/visualization/" className="btn btn--ghost">Build my system</a>
              </div>
            </div>
            <ul>
              <li><div><strong>Expert system design</strong><span>Camera count, placement and lens choice tailored to your volume.</span></div></li>
              <li><div><strong>Installation & training</strong><span>On-site setup and training from Vicon engineers.</span></div></li>
              <li><div><strong>Flexible purchasing</strong><span>Quotes, purchase orders and multi-year support plans.</span></div></li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section section--alt" id="faqs">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="eyebrow">FAQs</span>
            <h2>Questions, answered</h2>
          </div>
          <Faq />
        </div>
      </section>

      {/* Get in touch */}
      <ContactSection />
    </>
  );
}
