import { ContactForm } from './ContactForm';
import { Mail, Pin, Doc } from './Icons';

export function ContactSection({ topic, product, dark = true }: { topic?: string; product?: string; dark?: boolean }) {
  return (
    <section className={`section ${dark ? 'section--dark' : ''}`} id="contact">
      <div className="container contact">
        <div>
          <span className="eyebrow">Get in touch</span>
          <h2>Talk to the Vicon team</h2>
          <p className="lede">Questions about an order, need a quote or purchase order, or not sure what you need? Send us a message and a specialist will get back to you.</p>
          <div className="contact__info">
            <div><span className="trust__icon"><Mail /></span><div><strong>Sales & orders</strong><span>A specialist replies within one working day</span></div></div>
            <div><span className="trust__icon"><Doc /></span><div><strong>Quotes & purchase orders</strong><span>Invoice accounts for universities, hospitals and businesses</span></div></div>
            <div><span className="trust__icon"><Pin /></span><div><strong>Global offices</strong><span>Oxford · Denver · Los Angeles · Singapore</span></div></div>
          </div>
        </div>
        <ContactForm topic={topic} product={product} />
      </div>
    </section>
  );
}
