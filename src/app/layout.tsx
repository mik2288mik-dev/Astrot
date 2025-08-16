'use client';
import Script from 'next/script';
import '@/app/globals.css';
import { TelegramProvider } from '@/providers/telegram-provider';
import { TelegramViewportProvider } from '@/providers/telegram-viewport';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body>
        <TelegramProvider>
          <TelegramViewportProvider>
            <div id="app-root" className="app-shell">
              {children}
            </div>
          </TelegramViewportProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}