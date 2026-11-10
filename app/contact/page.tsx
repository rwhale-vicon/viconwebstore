import Link from 'next/link';
import { ContactSection } from '@/components/ContactSection';
import { Faq } from '@/components/Faq';

export const metadata = { title: 'Get in touch' };

export default async function Contact({ searchParams }: { searchParams: Promise<{ topic?: string; product?: string }> }) {
  const { topic, product } = await searchParams;
  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">Home</Link> / <span>Get in touch</span></div>
          <h1>Get in touch</h1>
          <p>Questions about an order, quotes and purchase orders, or a custom motion capture system — we’re here to help.</p>
        </div>
      </section>
      <ContactSection topic={product ? 'quote' : topic} product={product} dark={false} />
      <section className="section section--alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}><h2>Common questions</h2></div>
          <Faq limit={5} />
        </div>
      </section>
    </>
  );
}
