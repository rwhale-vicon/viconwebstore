'use client';
import { useState } from 'react';

const TOPICS = [
  { v: 'order', l: 'Help with an order' },
  { v: 'custom', l: 'Custom / full motion capture system' },
  { v: 'quote', l: 'Quote or purchase order' },
  { v: 'licence', l: 'Software licensing' },
  { v: 'other', l: 'Something else' },
];

export function ContactForm({ topic = 'order', product }: { topic?: string; product?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      setState(res.ok ? 'done' : 'error');
    } catch { setState('error'); }
  }

  if (state === 'done') {
    return (
      <div className="form form__success">
        <h3>Thanks — we’ve got your message</h3>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>A member of the Vicon team will be in touch within one working day.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__row">
        <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required autoComplete="name" /></div>
        <div className="field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
      </div>
      <div className="form__row">
        <div className="field"><label htmlFor="company">Organisation</label><input id="company" name="company" autoComplete="organization" /></div>
        <div className="field">
          <label htmlFor="country">Country</label>
          <select id="country" name="country" defaultValue="United States">
            <option>United States</option><option>United Kingdom</option><option>Canada</option><option>Other</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="topic">How can we help?</label>
        <select id="topic" name="topic" defaultValue={topic}>{TOPICS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}</select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required defaultValue={product ? `I'd like a quote for ${product}.` : ''} placeholder="Tell us about your application, capture volume or the products you need." />
      </div>
      <button className="btn btn--primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
      {state === 'error' && <p className="form__note" style={{ color: '#b42318' }}>Something went wrong — please try again.</p>}
      <p className="form__note">We’ll only use your details to respond to this enquiry. See Vicon’s privacy policy.</p>
    </form>
  );
}
