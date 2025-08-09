import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Deepsoul — Your Cosmic Map',
  description: 'Legendary Telegram Web App for natal charts and cosmic insights',
  themeColor: '#FFF4E6'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body className="min-h-dvh flex flex-col">
        <main className="flex-1 pb-20">
          <Providers>
            <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">{children}</div>
          </Providers>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}