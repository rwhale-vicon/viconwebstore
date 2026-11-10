import Link from 'next/link';
import { HeroFigure } from '@/components/Art';
import { ABOUT_STATS, MARKETS } from '@/lib/content';

export const metadata = { title: 'About Vicon' };

const TIMELINE = [
  { year: '1979', text: 'The first Vicon system is introduced to market by Oxford Medical Systems.' },
  { year: '1984', text: 'Vicon officially begins trading following a management buyout.' },
  { year: '2003', text: 'Sony Pictures Imageworks becomes the first studio to use over 200 Vicon cameras, for Monster House.' },
  { year: '2015', text: 'The Vantage V16 camera launches, replacing the T160.' },
  { year: '2017', text: 'Shōgun launches and Vicon acquires IMeasureU.' },
  { year: '2022', text: 'Valkyrie, Vicon’s most advanced camera range, is unveiled.' },
];

const VALUES = [
  { t: 'Pioneering', d: 'Pushing the boundaries of what motion capture can do.' },
  { t: 'Collaborative', d: 'Working closely with customers and partners.' },
  { t: 'Dynamic', d: 'Adapting quickly to new markets and technologies.' },
  { t: 'Inspiring', d: 'Enabling discoveries and stories that move people.' },
  { t: 'Remarkable', d: 'We go beyond motion.' },
];

export default function About() {
  return (
    <>
      <section className="page-head">
        <div className="container split">
          <div>
            <div className="crumbs"><Link href="/">Home</Link> / <span>About Vicon</span></div>
            <h1>Over 40 years of motion capture</h1>
            <p>Vicon is a global leader in motion capture technology. From Oxford to Singapore, Denver to Los Angeles, our teams help customers capture human and object motion with sub-millimetre precision.</p>
          </div>
          <div style={{ maxWidth: 340, justifySelf: 'center', width: '100%' }}><HeroFigure /></div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="prose">
            <span className="eyebrow">Our vision</span>
            <h2>To analyse and enhance the potential for human motion for the benefit of all</h2>
            <p>Vicon designs and builds motion capture cameras, software and accessories in-house. Our systems are used by world-leading gait labs, sports scientists, VFX and games studios, virtual production stages, engineers and location-based VR operators.</p>
            <p>The Vicon Store makes it simple for existing customers to restock genuine markers, suits and consumables, and to add software licences, without waiting for a quote.</p>
            <div className="pill-list">{MARKETS.map((m) => <span key={m} className="pill">{m}</span>)}</div>
          </div>
          <div className="stat-grid">
            {ABOUT_STATS.map((s) => <div key={s.label} className="stat"><strong>{s.value}</strong><span>{s.label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div>
            <span className="eyebrow">Our history</span>
            <h2>Milestones</h2>
            <p className="lede">Four decades of firsts in optical motion capture.</p>
          </div>
          <div className="timeline">
            {TIMELINE.map((t) => <div key={t.year}><strong>{t.year}</strong><span>{t.text}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Our values</span>
          <h2 style={{ marginBottom: 28 }}>What drives us</h2>
          <div className="values">{VALUES.map((v) => <div key={v.t} className="value"><h3>{v.t}</h3><p>{v.d}</p></div>)}</div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to restock your volume?</h2>
          <p className="lede" style={{ margin: '0 auto 28px' }}>Shop genuine Vicon markers, suits, kits and software licences.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn--primary">Shop now</Link>
            <a href="https://www.vicon.com/about-us/" className="btn btn--ghost">Visit vicon.com</a>
          </div>
        </div>
      </section>
    </>
  );
}
