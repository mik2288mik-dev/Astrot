import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Deepsoul — Your Cosmic Map',
  description: 'Legendary Telegram Web App for natal charts and cosmic insights',
  themeColor: '#0f172a'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col">
        <main className="flex-1 pb-20"><Providers>{children}</Providers></main>
      </body>
    </html>
  );
}