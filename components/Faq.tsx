import { FAQS } from '@/lib/content';

export function Faq({ limit }: { limit?: number }) {
  return (
    <div className="faq">
      {FAQS.slice(0, limit).map((f, i) => (
        <details key={f.q} open={i === 0}>
          <summary>{f.q}</summary>
          <div>{f.a}</div>
        </details>
      ))}
    </div>
  );
}
