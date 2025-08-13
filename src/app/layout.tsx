import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { TelegramProvider } from '@/providers/telegram-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { BottomNav } from '@/components/nav/bottom-nav';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { TelegramViewportProvider } from '@/providers/telegram-viewport';
import ExpandOverlay from '@/components/viewport/ExpandOverlay';
import ViewportDebug from '@/components/viewport/ViewportDebug';

const inter = Inter({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '700'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Astrot — Твоя личная астрология',
  description: 'Нативное мини‑приложение Telegram для астрологии',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.variable} h-full min-h-full overflow-hidden bg-[rgb(var(--astrot-bg))] text-[rgb(var(--astrot-text))] font-sans`}>
        <TelegramViewportProvider>
          <TelegramProvider>
            <ThemeProvider>
              <div className="app-shell" data-app-root>
                <main className="flex-1 overflow-auto pb-[var(--bottom-nav-total)]" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="px-4 pb-4 max-w-lg mx-auto">{children}</div>
                </main>
                <BottomNav />
              </div>
            </ThemeProvider>
          </TelegramProvider>
          <ViewportDebug />
          <ExpandOverlay />
        </TelegramViewportProvider>
      </body>
    </html>
  );
}