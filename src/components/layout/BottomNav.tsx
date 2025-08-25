'use client'

import { useRouter } from 'next/navigation'
import { appBar, button3d, iconButton, label } from '@/ui/variants'
import HomeIcon from '@/ui/icons/home.svg'
import AppsAstroIcon from '@/ui/icons/apps-astro.svg'
import AstrotLogoIcon from '@/ui/icons/astrot-logo.svg'

export default function BottomNav() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div
      className={appBar({ variant: 'bottom' }) + ' h-[64px] px-5 motion-safe:animate-fade-up delay-100'}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative h-16 flex items-center justify-between">
        {/* Кнопка Домой */}
        <button onClick={() => handleNavigation('/')} className="flex flex-col items-center gap-1">
          <span className={iconButton({ size: 48 })}>
            <HomeIcon width={24} height={24} />
          </span>
          <span className={label({ size: 'xs', weight: 'semibold' })}>Домой</span>
        </button>

        {/* Центральная кнопка Карта */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5">
          <button onClick={() => handleNavigation('/map')} className="relative flex flex-col items-center gap-1">
            <span className={button3d({ size: 64 }) + ' ring-4 ring-white/25'}>
              <AstrotLogoIcon width={24} height={24} />
            </span>
            <span className={label({ size: 'xs', weight: 'semibold' }) + ' mt-1'}>Карта</span>
          </button>
        </div>

        {/* Кнопка Ещё */}
        <button onClick={() => handleNavigation('/more')} className="flex flex-col items-center gap-1">
          <span className={iconButton({ size: 48 })}>
            <AppsAstroIcon width={24} height={24} />
          </span>
          <span className={label({ size: 'xs', weight: 'semibold' })}>Ещё</span>
        </button>
      </div>
    </div>
  )
}