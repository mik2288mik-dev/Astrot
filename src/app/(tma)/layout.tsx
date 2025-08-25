import Script from 'next/script'
import type { Metadata } from 'next'
import '@/app/globals.css'
import { Manrope } from 'next/font/google'
import { TWAProvider } from '@/providers/TWAProvider'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default function TMALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <TWAProvider>
        <div 
          className={`${manrope.className} min-h-screen`}
          style={{
            // iOS safe areas
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
            // Base 8pt grid system
            '--grid-unit': '8px',
            '--spacing-1': '8px',
            '--spacing-2': '16px',
            '--spacing-3': '24px',
            '--spacing-4': '32px',
            '--spacing-5': '40px',
            '--spacing-6': '48px',
            '--spacing-7': '56px',
            '--spacing-8': '64px',
          } as React.CSSProperties}
        >
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </TWAProvider>
    </>
  )
}