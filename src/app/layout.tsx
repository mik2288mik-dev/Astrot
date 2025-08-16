'use client';
import Script from 'next/script';
import '@/app/globals.css';
import { TelegramProvider } from '@/providers/telegram-provider';
import { TelegramViewportProvider } from '@/providers/telegram-viewport';
import NavBar from '@/components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TelegramProvider>
          <TelegramViewportProvider>
            <div className="app-container">
              <main className="main-content">
                {children}
              </main>
              <NavBar />
            </div>
          </TelegramViewportProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}