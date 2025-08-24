'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * BottomNav компонент в стиле BOINKERS
 * Высота: 64px + safe area bottom
 * Три пункта: Домой | Карта (центр, 3D) | Ещё
 */
export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);
  
  // Определяем активный пункт
  const isHomeActive = pathname === '/' || pathname === '/home';
  const isMapActive = pathname === '/map' || pathname === '/natal';
  const isMoreActive = pathname === '/more' || pathname === '/apps';
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-surfaceDark border-t border-white/[0.22] shadow-navDark"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Основная навигация"
    >
      <div className="h-16 relative flex items-center justify-around px-4">
        {/* Левая кнопка - Домой */}
        <button
          onClick={() => handleNavigation('/')}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] p-2 transition-all duration-200 active:scale-95"
          aria-label="Домой"
          aria-current={isHomeActive ? 'page' : undefined}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            className={`transition-colors ${isHomeActive ? 'text-white' : 'text-white/60'}`}
          >
            <path 
              d="M4 10.5C4 9.5 4.5 8.5 5.5 7.5L11 3C11.5 2.5 12.5 2.5 13 3L18.5 7.5C19.5 8.5 20 9.5 20 10.5V19C20 20.5 19 21 17.5 21H6.5C5 21 4 20.5 4 19V10.5Z" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M10 21V15C10 14 10.5 13 12 13C13.5 13 14 14 14 15V21" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className={`text-xs font-manrope font-semibold mt-1 transition-colors ${isHomeActive ? 'text-white' : 'text-white/60'}`}>
            Домой
          </span>
        </button>
        
        {/* Центральная кнопка - Карта (3D эффект) */}
        <button
          onClick={() => handleNavigation('/natal')}
          className="absolute left-1/2 -translate-x-1/2 -top-5 group"
          aria-label="Карта"
          aria-current={isMapActive ? 'page' : undefined}
        >
          {/* Внешний круг с градиентом и эффектами */}
          <div 
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accentFrom to-accentTo shadow-logo3D transition-all duration-200 group-active:scale-96 group-active:shadow-lg"
            style={{
              border: '3px solid rgba(255,255,255,0.25)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.45), inset 0 4px 8px rgba(255,255,255,0.25)',
            }}
          >
            {/* Внутренний блик для 3D эффекта */}
            <div 
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)',
              }}
            />
            
            {/* Иконка логотипа */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
                className="text-white"
              >
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 6L14 10.5L19 11L15.5 14L16.5 19L12 16.5L7.5 19L8.5 14L5 11L10 10.5Z" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {/* Пульсирующий эффект при активном состоянии */}
            {isMapActive && (
              <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-gradient-to-br from-accentFrom to-accentTo" />
            )}
          </div>
          
          {/* Подпись под кнопкой */}
          <span className={`text-xs font-manrope font-semibold mt-2 block transition-colors ${isMapActive ? 'text-white' : 'text-white/80'}`}>
            Карта
          </span>
        </button>
        
        {/* Правая кнопка - Ещё */}
        <button
          onClick={() => handleNavigation('/apps')}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] p-2 transition-all duration-200 active:scale-95"
          aria-label="Ещё"
          aria-current={isMoreActive ? 'page' : undefined}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            className={`transition-colors ${isMoreActive ? 'text-white' : 'text-white/60'}`}
          >
            {/* Grid of rounded squares 2x3 */}
            <rect 
              x="3" 
              y="3" 
              width="6" 
              height="6" 
              rx="2" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <rect 
              x="15" 
              y="3" 
              width="6" 
              height="6" 
              rx="2" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <rect 
              x="3" 
              y="9" 
              width="6" 
              height="6" 
              rx="2" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <rect 
              x="15" 
              y="9" 
              width="6" 
              height="6" 
              rx="2" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <rect 
              x="3" 
              y="15" 
              width="6" 
              height="6" 
              rx="2" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <rect 
              x="15" 
              y="15" 
              width="6" 
              height="6" 
              rx="2" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Small star in top right corner */}
            <path 
              d="M18 2L18.5 3L19.5 3.5L18.5 4L18 5L17.5 4L16.5 3.5L17.5 3Z" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className={`text-xs font-manrope font-semibold mt-1 transition-colors ${isMoreActive ? 'text-white' : 'text-white/60'}`}>
            Ещё
          </span>
        </button>
      </div>
    </nav>
  );
}