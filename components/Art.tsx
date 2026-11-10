/* Placeholder illustrations (pure SVG) used until product photography is loaded into Shopify. */

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const BG: Record<string, [string, string]> = {
  marker: ['#0a1439', '#1b2b66'],
  suit: ['#0d1a47', '#23367a'],
  kit: ['#0a1439', '#173062'],
  joint: ['#0b173f', '#1f3070'],
  rigid: ['#0a1439', '#202f6e'],
  active: ['#08102e', '#1b2b66'],
  tape: ['#0c1842', '#1d3168'],
  licence: ['#060c26', '#1b2b66'],
};

function Marker({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.9} fill="url(#glow)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#sphere)" />
    </g>
  );
}

const SKELETON: [number, number][] = [
  [200, 52], [200, 92], [168, 104], [232, 104], [150, 150], [250, 150], [140, 196], [260, 196],
  [200, 150], [178, 196], [222, 196], [172, 252], [228, 252], [168, 298], [232, 298],
];
const BONES: [number, number][] = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [1, 8], [8, 9], [8, 10], [9, 11], [10, 12], [11, 13], [12, 14]];

function Figure({ scale = 1, dx = 0, dy = 0 }: { scale?: number; dx?: number; dy?: number }) {
  const p = SKELETON.map(([x, y]) => [x * scale + dx, y * scale + dy]);
  return (
    <g>
      {BONES.map(([a, b], i) => (
        <line key={i} x1={p[a][0]} y1={p[a][1]} x2={p[b][0]} y2={p[b][1]} stroke="#19d3c5" strokeOpacity=".45" strokeWidth={2 * scale} />
      ))}
      {p.map(([x, y], i) => <Marker key={i} cx={x} cy={y} r={(i === 0 ? 9 : 6) * scale} />)}
    </g>
  );
}

function Motif({ art, seed }: { art: string; seed: number }) {
  const j = (n: number) => ((seed >> n) % 20) - 10;
  switch (art) {
    case 'marker': {
      // Vary marker layout by product so cards are distinguishable.
      const big = 30 + (seed % 26);
      const n = 3 + (seed % 4);
      const pts = Array.from({ length: n }).map((_, i) => {
        const a = ((seed >> (i * 3)) % 360) * (Math.PI / 180);
        const d = 95 + ((seed >> (i * 2)) % 50);
        return [200 + Math.cos(a) * d * 1.3, 160 + Math.sin(a) * d * 0.8, 6 + ((seed >> (i + 2)) % 18)];
      });
      return (
        <g>
          {pts.map(([x, y, r], i) => <Marker key={i} cx={Math.max(30, Math.min(370, x))} cy={Math.max(30, Math.min(290, y))} r={r} />)}
          <Marker cx={190 + j(1)} cy={160 + j(4)} r={big} />
        </g>
      );
    }
    case 'suit':
      return <Figure scale={0.85} dx={30 + j(1)} dy={20} />;
    case 'kit':
      return (
        <g>
          <rect x="80" y="96" width="240" height="150" rx="16" fill="#0a1439" stroke="#4a5a8f" strokeWidth="3" />
          <rect x="170" y="78" width="60" height="22" rx="8" fill="none" stroke="#4a5a8f" strokeWidth="3" />
          {[0, 1, 2, 3, 4].map((i) => <Marker key={i} cx={116 + i * 42} cy={142} r={11} />)}
          {[0, 1, 2, 3, 4].map((i) => <Marker key={`b${i}`} cx={116 + i * 42} cy={198} r={8} />)}
        </g>
      );
    case 'joint':
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${110 + i * 90} ${j(i + 1)})`}>
              <ellipse cx="0" cy="236" rx="34" ry="10" fill="#2a3a78" />
              <rect x="-3" y="140" width="6" height="94" fill="#7c84a3" rx="3" />
              <Marker cx={0} cy={128} r={18} />
            </g>
          ))}
        </g>
      );
    case 'rigid': {
      const pts: [number, number][] = [[130, 110], [270, 96], [292, 214], [150, 232]];
      return (
        <g>
          <polygon points="120,120 280,100 300,220 140,240" fill="#16245a" stroke="#4a5a8f" strokeWidth="3" />
          {pts.map(([x, y], i) => <line key={i} x1={x} y1={y} x2={pts[(i + 2) % 4][0]} y2={pts[(i + 2) % 4][1]} stroke="#19d3c5" strokeOpacity=".35" strokeWidth="2" />)}
          {pts.map(([x, y], i) => <Marker key={`m${i}`} cx={x} cy={y} r={14} />)}
        </g>
      );
    }
    case 'active':
      return (
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={200 + Math.cos(a) * 60} y1={160 + Math.sin(a) * 60} x2={200 + Math.cos(a) * 120} y2={160 + Math.sin(a) * 120} stroke="#19d3c5" strokeOpacity=".25" strokeWidth="2" />;
          })}
          <rect x="150" y="120" width="100" height="80" rx="18" fill="#0a1439" stroke="#4a5a8f" strokeWidth="3" />
          {[[170, 140], [230, 140], [170, 180], [230, 180], [200, 160]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="16" fill="url(#led)" />
              <circle cx={x} cy={y} r="5" fill="#eafffd" />
            </g>
          ))}
        </g>
      );
    case 'tape':
      return (
        <g>
          {[[140, 160, 70], [262, 130, 48], [270, 236, 34]].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="#22357a" stroke="#4a5a8f" strokeWidth="3" />
              <circle cx={x} cy={y} r={r * 0.45} fill="#0a1439" stroke="#4a5a8f" strokeWidth="3" />
            </g>
          ))}
          <path d="M140 230 L 60 300" stroke="#22357a" strokeWidth="26" />
        </g>
      );
    case 'licence':
      return (
        <g>
          <rect x="70" y="70" width="260" height="170" rx="14" fill="#0a1439" stroke="#4a5a8f" strokeWidth="3" />
          <rect x="70" y="70" width="260" height="24" rx="12" fill="#16245a" />
          {[0, 1, 2].map((i) => <circle key={i} cx={88 + i * 14} cy={82} r="4" fill="#4a5a8f" />)}
          <Figure scale={0.42} dx={116 + j(2)} dy={88} />
          <polyline points="230,200 250,170 268,186 290,140 310,156" fill="none" stroke="#2f7bff" strokeWidth="3" />
          <rect x="170" y="252" width="60" height="10" rx="5" fill="#4a5a8f" />
        </g>
      );
    default:
      return <Marker cx={200} cy={160} r={40} />;
  }
}

export function Art({ art, seed = 'x', label }: { art: string; seed?: string; label?: string }) {
  const s = hash(seed);
  const [a, b] = BG[art] ?? BG.marker;
  const id = `a${hash(art + seed)}`;
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" role="img" aria-label={label ?? art} style={{ height: '100%' }}>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <pattern id={`${id}grid`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#ffffff" strokeOpacity=".05" />
        </pattern>
      </defs>
      <rect width="400" height="320" fill={`url(#${id}bg)`} />
      <rect width="400" height="320" fill={`url(#${id}grid)`} />
      <Motif art={art} seed={s} />
    </svg>
  );
}

export function HeroFigure() {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" role="img" aria-label="Motion capture skeleton made of reflective markers">
      <circle cx="200" cy="200" r="190" fill="url(#halo)" />
      {[150, 115, 80].map((r, i) => (
        <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#ffffff" strokeOpacity={0.06 + i * 0.03} strokeDasharray="2 8">
          <animateTransform attributeName="transform" type="rotate" from={`0 200 200`} to={`${i % 2 ? -360 : 360} 200 200`} dur={`${40 + i * 15}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g transform="translate(0 30)">
        <Figure />
      </g>
    </svg>
  );
}

/** Shared gradients referenced by every illustration. Rendered once in the root layout. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sphere" cx=".35" cy=".35" r=".75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor="#c9d2ea" />
          <stop offset="1" stopColor="#6d7aa8" />
        </radialGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#19d3c5" stopOpacity=".4" />
          <stop offset="1" stopColor="#19d3c5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="led">
          <stop offset="0" stopColor="#19d3c5" stopOpacity=".9" />
          <stop offset="1" stopColor="#19d3c5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="halo">
          <stop offset="0" stopColor="#2f7bff" stopOpacity=".35" />
          <stop offset="1" stopColor="#2f7bff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
