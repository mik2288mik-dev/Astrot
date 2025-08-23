import Script from 'next/script';
import type { Metadata } from 'next';
import '@/app/globals.css';
import '@/styles/tokens.css';
import '@/styles/nebula.css';
import '@/styles/ui-kit.css';
import '@/styles/safe.css';
import { TelegramProvider } from '@/providers/telegram-provider';
import { TelegramViewportProvider } from '@/providers/telegram-viewport';
import { ThemeProvider } from '@/providers/ThemeProvider';
import SafeArea from '@/components/layout/SafeArea';
import TopBar from '@/components/top/TopBar';
import BottomNav from '@/components/navigation/BottomNav';
import { Inter, Manrope } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Astrot - Астрологическое приложение',
  description: 'Персональные гороскопы, натальные карты и астрологические консультации',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    apple: '/logo.png'
  },
  manifest: '/manifest.webmanifest',
  themeColor: '#000000',
  viewport: 'width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans min-h-screen bg-gradient-to-b from-[#FFF6FB] to-[#FBEFFF]`}>
        <TelegramProvider>
          <TelegramViewportProvider>
            <ThemeProvider>
              <TopBar />
              <SafeArea>
                <div className="min-h-screen flex flex-col" style={{paddingTop:'calc(env(safe-area-inset-top) + 56px + 8px)'}}>
                  <main className="flex-1 overflow-y-auto">
                    {children}
                  </main>
                  <div style={{height:'calc(72px + env(safe-area-inset-bottom))'}} />
                </div>
              </SafeArea>
              <BottomNav />
            </ThemeProvider>
          </TelegramViewportProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
