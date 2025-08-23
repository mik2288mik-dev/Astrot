'use client'

import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { astrotColors } from '../../styles/colors'

/**
 * BottomNav компонент с 3D центральной кнопкой
 * Высота: 72px + env(safe-area-inset-bottom)
 */
export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="mx-auto max-w-screen-md px-4">
        <div 
          className="relative h-[72px] rounded-[24px] flex items-center justify-between px-8"
          style={{
            background: astrotColors.background.card,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: astrotColors.shadows.strong,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* Левая кнопка - Домой */}
          <button
            onClick={() => router.push('/home')}
            className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-95"
            aria-label="Домой"
          >
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300"
              style={{
                background: isActive('/home') 
                  ? astrotColors.gradients.accent 
                  : 'rgba(255, 255, 255, 0.4)',
                boxShadow: isActive('/home') 
                  ? astrotColors.shadows.soft 
                  : 'none',
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
                style={{
                  color: isActive('/home') 
                    ? astrotColors.neutral.white 
                    : astrotColors.neutral.gray
                }}
              >
                <path 
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M9 22V12h6v10" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span 
              className="font-manrope text-xs font-medium"
              style={{
                color: isActive('/home') 
                  ? astrotColors.accent.purple 
                  : astrotColors.neutral.gray
              }}
            >
              Домой
            </span>
          </button>

          {/* Центральная кнопка - 3D логотип Astrot */}
          <button
            onClick={() => router.push('/natal')}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-5 group"
            aria-label="Карта"
          >
            <div 
              className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-active:scale-95"
              style={{
                background: astrotColors.gradients.glow,
                boxShadow: `
                  0 8px 32px rgba(139, 92, 246, 0.35),
                  0 0 80px rgba(236, 72, 153, 0.2),
                  inset 0 2px 4px rgba(255, 255, 255, 0.6),
                  inset 0 -2px 8px rgba(139, 92, 246, 0.3)
                `,
                transform: 'translateZ(20px)',
              }}
            >
              {/* Внутреннее свечение */}
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)',
                }}
              />
              
              {/* 3D эффект ободка */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 180deg at 50% 50%, rgba(255, 255, 255, 0.3) 0deg, transparent 60deg, transparent 300deg, rgba(255, 255, 255, 0.3) 360deg)',
                }}
              />

              {/* Логотип */}
              <div className="relative z-10 w-10 h-10">
                <Image 
                  src="/logo.png" 
                  alt="Astrot" 
                  fill 
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>

              {/* Эффект нажатия */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-200"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                }}
              />
            </div>

            {/* Подпись */}
            <span 
              className="block mt-2 font-manrope text-xs font-semibold"
              style={{
                color: isActive('/natal') 
                  ? astrotColors.accent.purple 
                  : astrotColors.neutral.dark,
                textShadow: '0 2px 4px rgba(139, 92, 246, 0.2)',
              }}
            >
              Карта
            </span>
          </button>

          {/* Правая кнопка - Ещё */}
          <button
            onClick={() => router.push('/more')}
            className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-95"
            aria-label="Ещё"
          >
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300"
              style={{
                background: isActive('/more') 
                  ? astrotColors.gradients.accent 
                  : 'rgba(255, 255, 255, 0.4)',
                boxShadow: isActive('/more') 
                  ? astrotColors.shadows.soft 
                  : 'none',
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
                style={{
                  color: isActive('/more') 
                    ? astrotColors.neutral.white 
                    : astrotColors.neutral.gray
                }}
              >
                <circle cx="12" cy="5" r="2" fill="currentColor"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <circle cx="12" cy="19" r="2" fill="currentColor"/>
              </svg>
            </div>
            <span 
              className="font-manrope text-xs font-medium"
              style={{
                color: isActive('/more') 
                  ? astrotColors.accent.purple 
                  : astrotColors.neutral.gray
              }}
            >
              Ещё
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}