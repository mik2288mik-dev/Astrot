'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, MoreVertical } from 'lucide-react'

/**
 * BottomNav компонент в стиле Boinkers
 * Высота: 64px + safe-area-inset-bottom
 * Прямая темная планка с 3D центральной кнопкой
 */
export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-surfaceDark border-t border-white/[0.22] shadow-nav-dark"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
      }}
    >
      <div className="h-16 flex items-center justify-between px-5 relative">
        {/* Левая кнопка - Домой */}
        <button
          onClick={() => router.push('/home')}
          className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 hover:scale-105 w-12 h-12 rounded-xl"
          aria-label="Домой"
        >
          <div className="flex flex-col items-center">
            <Home
              size={24}
              strokeWidth={2.5}
              className={`transition-colors ${
                isActive('/home') ? 'text-white' : 'text-white/60'
              }`}
            />
            <span className={`font-manrope text-xs mt-1 ${
              isActive('/home') ? 'text-white' : 'text-white/60'
            }`}>
              Домой
            </span>
          </div>
        </button>

        {/* Центральная кнопка - Карта */}
        <button
          onClick={() => router.push('/natal')}
          className="absolute left-1/2 -translate-x-1/2 -top-8 group"
          aria-label="Карта"
        >
          <div 
            className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-active:scale-95"
            style={{
              background: 'linear-gradient(145deg, #cf5cff 0%, #ff6ad9 100%)',
              border: '3px solid rgba(255, 255, 255, 0.25)',
              boxShadow: `
                0 6px 12px rgba(0, 0, 0, 0.45),
                inset 0 4px 6px rgba(0, 0, 0, 0.4)
              `,
            }}
          >
            {/* Внутреннее свечение */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
              }}
            />
            
            {/* Иконка карты */}
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none"
              className="relative z-10 text-white"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>

            {/* Эффект нажатия */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-200"
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Подпись */}
          <span className="block mt-2 font-manrope text-xs font-semibold text-white">
            Карта
          </span>
        </button>

        {/* Правая кнопка - Ещё */}
        <button
          onClick={() => router.push('/more')}
          className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 hover:scale-105 w-12 h-12 rounded-xl"
          aria-label="Ещё"
        >
          <div className="flex flex-col items-center">
            <MoreVertical
              size={24}
              strokeWidth={2.5}
              className={`transition-colors ${
                isActive('/more') ? 'text-white' : 'text-white/60'
              }`}
            />
            <span className={`font-manrope text-xs mt-1 ${
              isActive('/more') ? 'text-white' : 'text-white/60'
            }`}>
              Ещё
            </span>
          </div>
        </button>
      </div>
    </nav>
  )
}