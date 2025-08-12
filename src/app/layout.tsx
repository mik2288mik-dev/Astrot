import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import { TelegramProvider } from '@/providers/telegram-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { BottomNav } from '@/components/nav/bottom-nav';
import Script from 'next/script';
import { Inter } from 'next/font/google';

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
        <link rel="manifest" href="/manifest.webmanifest" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <Script id="tg-autoinit" strategy="beforeInteractive">
          {`(function(){try{var w=window.Telegram&&window.Telegram.WebApp; if(!w) return; w.ready&&w.ready(); w.expand&&w.expand(); var once=function(){try{w.ready&&w.ready(); w.expand&&w.expand();}catch(e){}; window.removeEventListener('click',once); window.removeEventListener('touchstart',once); window.removeEventListener('pointerdown',once);}; window.addEventListener('click',once,{once:true,passive:true}); window.addEventListener('touchstart',once,{once:true,passive:true}); window.addEventListener('pointerdown',once,{once:true,passive:true});}catch(e){}})();`}
        </Script>
      </head>
      <body className={`${inter.variable} min-h-screen h-full overflow-hidden bg-[rgb(var(--astrot-bg))] text-[rgb(var(--astrot-text))] font-sans`}>
        <TelegramProvider>
          <ThemeProvider>
            <main className="min-h-[var(--tg-viewport-height)] pb-[var(--bottom-nav-total)]">
              <div className="px-4 pb-4 max-w-lg mx-auto">{children}</div>
            </main>
            <BottomNav />
          </ThemeProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}