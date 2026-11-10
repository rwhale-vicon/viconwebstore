import Link from 'next/link';
import { ContactSection } from '@/components/ContactSection';
import { Faq } from '@/components/Faq';
import { MINIMUM_ORDER } from '@/lib/pricing';
import pricing from '@/data/pricing.json';

export const metadata = { title: 'How it works' };

const pct = (d: number) => `${Math.round(d * 100)}%`;

export default function HowItWorks() {
  const hw = pricing.tiers.hardware;
  const lic = pricing.tiers.licence;
  const steps = [
    { title: 'Find what you need', text: 'Browse by category or search by part number. Every product page shows full specifications, pack sizes and compatible systems.',
      points: ['Markers, suits, kits, accessories and software licences in one place', 'Prices shown in US dollars or pounds sterling', 'Not sure what you need? Our team can recommend the right kit'] },
    { title: 'Volume pricing applied automatically', text: 'The more you order of a product, the less you pay per unit. Discounts are shown on the product page and applied in your cart instantly — no codes required.',
      points: [`Hardware: ${hw.filter((t) => t.discount).map((t) => `${pct(t.discount)} off ${t.min}+`).join(' · ')}`, `Licences: ${lic.filter((t) => t.discount).map((t) => `${pct(t.discount)} off ${t.min}+ seats`).join(' · ')}`, 'Your cart shows the total saving before you check out'] },
    { title: 'Secure checkout', text: `Check out securely with Shopify. Online orders have a minimum value of $${MINIMUM_ORDER.USD} / £${MINIMUM_ORDER.GBP}, before tax and shipping.`,
      points: ['Sales tax calculated automatically for your US state, or VAT for UK orders', 'Shipping options and costs shown before you pay', 'Need to pay by invoice or purchase order? Request a quote instead'] },
    { title: 'Order confirmation', text: 'You’ll receive an order confirmation by email straight away, and our team is notified so your order can be prepared.',
      points: ['Order details are synced to your Vicon account record', 'Questions? Reply to your confirmation email or contact us'] },
    { title: 'Delivery & activation', text: 'Hardware ships from Vicon, typically within 5 working days, with tracking. Software licences are delivered digitally — no waiting for a parcel.',
      points: ['Tracking information emailed on dispatch', 'Licence details and activation instructions sent by email', 'Support from the Vicon team whenever you need it'] },
  ];
  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">Home</Link> / <span>How it works</span></div>
          <h1>How the Vicon Store works</h1>
          <p>From choosing your markers to activating your licences — here’s what happens when you order online.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="process">
            {steps.map((s, i) => (
              <div key={s.title} className="process__step">
                <div className="process__num">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
          <div className="custom" style={{ marginTop: 48 }}>
            <div>
              <h2>Buying a full system?</h2>
              <p className="lede">Cameras and complete motion capture systems are configured by our specialists rather than bought online. We’ll design a system around your space and budget.</p>
            </div>
            <div><Link href="/contact?topic=custom" className="btn btn--primary">Speak to the team</Link></div>
          </div>
        </div>
      </section>
      <section className="section section--alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}><span className="eyebrow">FAQs</span><h2>Ordering questions</h2></div>
          <Faq />
        </div>
      </section>
      <ContactSection />
    </>
  );
}
