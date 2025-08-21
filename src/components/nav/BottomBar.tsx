'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { navTokens } from '@/styles/tokens';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  iconActive: React.ReactNode;
}

// Минималистичные SVG иконки
const HomeIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  <svg 
    className={className} 
    fill={filled ? 'currentColor' : 'none'} 
    stroke={!filled ? 'currentColor' : 'none'}
    strokeWidth={filled ? 0 : 2}
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {filled ? (
      <path d="M12.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L4 12.414V20a2 2 0 002 2h3a1 1 0 001-1v-5a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 001 1h3a2 2 0 002-2v-7.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    )}
  </svg>
);

const MenuIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={2}
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {filled ? (
      <g>
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
      </g>
    ) : (
      <g>
        <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
);

export default function BottomBar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: '/',
      label: 'Главная',
      icon: <HomeIcon className="w-6 h-6" />,
      iconActive: <HomeIcon className="w-6 h-6" filled />
    },
    {
      href: '/functions',
      label: 'Ещё',
      icon: <MenuIcon className="w-6 h-6" />,
      iconActive: <MenuIcon className="w-6 h-6" filled />
    }
  ];

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        paddingBottom: navTokens.spacing.safeAreaBottom,
      }}
    >
      {/* Фон с градиентом и blur эффектом */}
      <div 
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: navTokens.colors.navBg,
          borderTop: `1px solid ${navTokens.colors.navBorder}`,
          borderRadius: navTokens.borderRadius.nav,
          boxShadow: navTokens.shadows.nav,
        }}
      />
      
      {/* Контент навигации */}
      <div className="relative flex items-center justify-between px-6" style={{ height: navTokens.spacing.navHeight }}>
        
        {/* Левая кнопка - Главная */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all active:animate-tap ${
            isActive('/') ? 'text-violet-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{
            transition: navTokens.animation.transition,
          }}
        >
          {isActive('/') ? navItems[0].iconActive : navItems[0].icon}
          <span className="text-xs font-medium">{navItems[0].label}</span>
        </Link>

        {/* Центральная кнопка - Карта (Лого) */}
        <Link
          href="/chart"
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2"
          style={{
            width: navTokens.spacing.centerButtonSize,
            height: navTokens.spacing.centerButtonSize,
          }}
        >
          <div 
            className={`relative w-full h-full rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              isActive('/chart') ? 'animate-glow' : ''
            }`}
            style={{
              background: navTokens.colors.centerButton.bg,
              boxShadow: isActive('/chart') 
                ? navTokens.shadows.centerButtonHover 
                : navTokens.shadows.centerButton,
              borderRadius: navTokens.borderRadius.centerButton,
              transition: navTokens.animation.transition,
            }}
          >
            {/* Glow эффект */}
            {isActive('/chart') && (
              <div 
                className="absolute inset-0 rounded-2xl animate-pulse"
                style={{
                  background: navTokens.colors.centerButton.bg,
                  opacity: 0.3,
                  filter: 'blur(20px)',
                  borderRadius: navTokens.borderRadius.centerButton,
                }}
              />
            )}
            
            {/* Лого */}
            <div className="relative z-10 flex flex-col items-center">
              <Image
                src="/logo.svg"
                alt="Astrot"
                width={28}
                height={28}
                className="drop-shadow-lg"
                style={{
                  filter: 'brightness(0) invert(1)',
                }}
              />
              <span className="text-[10px] font-semibold text-white mt-1">Карта</span>
            </div>
          </div>
        </Link>

        {/* Правая кнопка - Ещё */}
        <Link
          href="/functions"
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all active:animate-tap ${
            isActive('/functions') ? 'text-violet-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{
            transition: navTokens.animation.transition,
          }}
        >
          {isActive('/functions') ? navItems[1].iconActive : navItems[1].icon}
          <span className="text-xs font-medium">{navItems[1].label}</span>
        </Link>
      </div>
    </nav>
  );
}