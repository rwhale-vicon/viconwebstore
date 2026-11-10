import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StoreProvider } from '@/components/StoreProvider';
import { SvgDefs } from '@/components/Art';
import { isDemo } from '@/lib/catalog';

export const metadata: Metadata = {
  title: { default: 'Vicon Store — Motion capture markers, suits & licences', template: '%s | Vicon Store' },
  description: 'Buy genuine Vicon motion capture markers, suits, accessory kits and software licences online.',
};

export const viewport: Viewport = { themeColor: '#0a1439' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SvgDefs />
        <StoreProvider>
          <Header demo={isDemo} />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
