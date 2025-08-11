import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { TelegramProvider } from '@/providers/telegram-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { BottomNav } from '@/components/nav/bottom-nav';
import Script from 'next/script';

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
        <link rel="manifest" href="/manifest.webmanifest" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-[var(--tg-viewport-height)] bg-bg text-text font-sans">
        <TelegramProvider>
          <ThemeProvider>
            <main className="min-h-[var(--tg-viewport-height)] pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))]">
              <div className="px-4 pb-4 max-w-lg mx-auto">{children}</div>
            </main>
            <BottomNav />
          </ThemeProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}