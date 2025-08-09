import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { BottomNav } from '@/components/BottomNav';
import Script from 'next/script';
import type { Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Astrot — Твоя личная астрология',
  description: 'Твое личное пространство для астрологии: натальная карта, точные прогнозы и советы на каждый день.'
};

export const viewport: Viewport = {
  themeColor: '#FFF4E6'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-dvh h-dvh flex flex-col safe-top font-sans">
        <main className="flex-1 h-full pb-20">
          <Providers>
            <div className="px-4 pb-4 max-w-lg mx-auto">{children}</div>
          </Providers>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}