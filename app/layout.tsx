import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SDKProvider } from "@telegram-apps/sdk-react";
import { TelegramAuthProvider } from "@/lib/telegram-auth";

export const metadata: Metadata = {
  title: "AstroT - Telegram Mini App",
  description: "Астрологическое приложение для Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="antialiased">
        <SDKProvider>
          <TelegramAuthProvider>
            {children}
          </TelegramAuthProvider>
        </SDKProvider>
      </body>
    </html>
  );
}
