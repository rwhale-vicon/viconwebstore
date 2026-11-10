'use client';
import { useEffect, useRef, useState } from 'react';

// Official white logo from vicon.com. For production, copy it into /public/brand and set
// NEXT_PUBLIC_LOGO_URL=/brand/logo-white.svg so the store doesn't depend on another site.
const LOGO = process.env.NEXT_PUBLIC_LOGO_URL || 'https://www.vicon.com/wp-content/themes/vicon/dist/img/logo-white.svg';

export function Logo() {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  if (failed) {
    return <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, letterSpacing: '.22em', fontSize: '1.25rem' }}>VICON</span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={LOGO} alt="Vicon" onError={() => setFailed(true)} />;
}
