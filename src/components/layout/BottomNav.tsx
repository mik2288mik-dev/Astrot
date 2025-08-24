'use client'

import { useRouter, usePathname } from 'next/navigation'

// SVG иконки inline
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L12 2L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AppsAstroIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="11" y="4" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="4" y="11" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="11" y="11" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="4" y="18" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="11" y="18" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 2L19.5 3.5L21 4L19.5 4.5L19 6L18.5 4.5L17 4L18.5 3.5L19 2Z" fill="currentColor"/>
  </svg>
)

const AstrotLogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L7 18M12 3L17 18M7 18L5 21M17 18L19 21M9 13H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
    <circle cx="5" cy="21" r="1" fill="currentColor"/>
    <circle cx="19" cy="21" r="1" fill="currentColor"/>
  </svg>
)

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 animate-[fadeUp_0.3s_ease-out]"
      style={{
        height: 'calc(64px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: '#1E1F36',
        borderTop: '1px solid rgba(255,255,255,.22)',
        boxShadow: '0 -4px 12px rgba(0,0,0,.45)'
      }}
    >
      <div className="relative h-16 flex items-center justify-between px-5">
        {/* Кнопка Домой */}
        <button 
          onClick={() => handleNavigation('/')}
          className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-transform duration-200 active:scale-[0.96]"
        >
          <div className="text-white">
            <HomeIcon />
          </div>
          <span className="text-white font-manrope font-semibold text-xs">
            Домой
          </span>
        </button>

        {/* Центральная кнопка Карта */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5">
          <button 
            onClick={() => handleNavigation('/map')}
            className="relative flex flex-col items-center gap-1 transition-transform duration-200 active:scale-[0.98]"
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white"
              style={{
                background: 'linear-gradient(145deg, #CF5CFF 0%, #FF6AD9 100%)',
                border: '3px solid rgba(255,255,255,.25)',
                boxShadow: '0 6px 12px rgba(0,0,0,.45), inset 0 4px 8px rgba(255,255,255,.25)'
              }}
            >
              <AstrotLogoIcon />
            </div>
            <span className="text-white font-manrope font-semibold text-xs mt-1">
              Карта
            </span>
          </button>
        </div>

        {/* Кнопка Ещё */}
        <button 
          onClick={() => handleNavigation('/more')}
          className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-transform duration-200 active:scale-[0.96]"
        >
          <div className="text-white">
            <AppsAstroIcon />
          </div>
          <span className="text-white font-manrope font-semibold text-xs">
            Ещё
          </span>
        </button>
      </div>
    </div>
  )
}