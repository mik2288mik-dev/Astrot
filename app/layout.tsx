import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { BottomNav } from '@/components/BottomNav';
import Script from 'next/script';
import type { Viewport } from 'next';
// Restored previous font stack: no runtime font imports

// Playfair import removed to revert to previous font stack

export const metadata: Metadata = {
  title: 'Astrot — Твоя личная астрология',
  description: 'Твое личное пространство для астрологии: натальная карта, точные прогнозы и советы на каждый день.'
};

export const viewport: Viewport = {
  themeColor: '#FFF4E6'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-[100svh] flex flex-col safe-top font-sans">
        <main className="flex-1 min-h-[100svh] pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))]">
          <Providers>
            <div className="px-4 pb-4 max-w-lg mx-auto">{children}</div>
          </Providers>
          {/* Sticky floating tabbar within the scroll container */}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}