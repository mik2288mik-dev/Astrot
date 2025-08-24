import Script from 'next/script'
import type { Metadata } from 'next'
import '@/app/globals.css'
import '@/styles/tokens.css'
import '@/styles/nebula.css'
import '@/styles/ui-kit.css'
import '@/styles/safe.css'
import { TelegramProvider } from '@/providers/telegram-provider'
import { TelegramViewportProvider } from '@/providers/telegram-viewport'
import { ThemeProvider } from '@/providers/ThemeProvider'
import SafeAreaInit from '@/components/SafeAreaInit'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { Manrope } from 'next/font/google'
import { astrotColors } from '../../styles/colors'

// Подключаем Manrope с поддержкой кириллицы
const manrope = Manrope({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
  themeColor: astrotColors.primary.start,
  viewport: 'width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body 
        className={`${manrope.className} min-h-screen`}
        style={{
          background: `linear-gradient(180deg, ${astrotColors.background.primary} 0%, ${astrotColors.background.secondary} 100%)`,
        }}
      >
        <SafeAreaInit />
        <TelegramProvider>
          <TelegramViewportProvider>
            <ThemeProvider>
              <TopBar />
              
              {/* Основной контент с правильными отступами */}
              <main 
                className="min-h-screen"
                style={{
                  paddingTop: 'calc(env(safe-area-inset-top) + 6px + 56px + 16px)',
                  paddingBottom: 'calc(64px + env(safe-area-inset-bottom) + 16px)',
                }}
              >
                <div className="mx-auto max-w-screen-md px-4">
                  {children}
                </div>
              </main>
              
              <BottomNav />
            </ThemeProvider>
          </TelegramViewportProvider>
        </TelegramProvider>
      </body>
    </html>
  )
}
