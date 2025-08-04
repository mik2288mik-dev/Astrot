import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { TelegramAuthProvider } from "../src/lib/telegram-auth";

export const metadata: Metadata = {
  title: "Astrot - Telegram App",
  description: "Telegram Mini App с авторизацией",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="antialiased">
        <TelegramAuthProvider>
          {children}
        </TelegramAuthProvider>
      </body>
    </html>
  );
}
