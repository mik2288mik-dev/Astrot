'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { navTokens } from '@/styles/tokens';

// Минималистичная иконка домика
const HomeIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// Минималистичная иконка меню (три точки)
const MoreIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export default function BottomBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-xl"
      style={{
        paddingBottom: navTokens.spacing.safeAreaBottom,
        borderTop: `1px solid ${navTokens.colors.navBorder}`,
        borderRadius: navTokens.borderRadius.nav,
        boxShadow: navTokens.shadows.nav,
      }}
    >
      {/* Контейнер для кнопок */}
      <div 
        className="relative flex items-center justify-between px-8"
        style={{ height: navTokens.spacing.navHeight }}
      >
        
        {/* Левая кнопка - Главная */}
        <Link
          href="/"
          className={`group flex flex-col items-center justify-center gap-1.5 rounded-xl px-4 py-2 transition-all active:animate-tap ${
            isActive('/') ? '' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <div 
            className="relative w-6 h-6"
            style={{
              background: isActive('/') ? navTokens.colors.gradient.active : navTokens.colors.gradient.home,
              WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/%3E%3Cpolyline points='9 22 9 12 15 12 15 22'/%3E%3C/svg%3E") center/contain no-repeat`,
              mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/%3E%3Cpolyline points='9 22 9 12 15 12 15 22'/%3E%3C/svg%3E") center/contain no-repeat`,
            }}
          />
          <span 
            className="text-center"
            style={{
              fontSize: navTokens.typography.fontSize,
              fontWeight: navTokens.typography.fontWeight,
              fontFamily: navTokens.typography.fontFamily,
              color: isActive('/') ? navTokens.colors.text.default : navTokens.colors.text.inactive,
            }}
          >
            Главная
          </span>
          {isActive('/') && (
            <div 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full"
              style={{ background: navTokens.colors.gradient.active }}
            />
          )}
        </Link>

        {/* Центральная кнопка - Карта (Лого) */}
        <Link
          href="/chart"
          className="absolute left-1/2 -translate-x-1/2 group"
          style={{
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div 
            className={`relative flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              isActive('/chart') ? 'animate-glow' : ''
            }`}
            style={{
              width: navTokens.spacing.centerButtonSize,
              height: navTokens.spacing.centerButtonSize,
            }}
          >
            {/* Фон кнопки с градиентом */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: navTokens.colors.gradient.center,
                boxShadow: isActive('/chart') 
                  ? navTokens.shadows.centerButtonHover 
                  : navTokens.shadows.centerButton,
                borderRadius: navTokens.borderRadius.centerButton,
              }}
            />
            
            {/* Внутренняя тень для объема */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: navTokens.colors.centerButton.innerShadow,
                borderRadius: navTokens.borderRadius.centerButton,
              }}
            />
            
            {/* Glow эффект при активном состоянии */}
            {isActive('/chart') && (
              <div 
                className="absolute inset-0 rounded-full animate-pulse-soft"
                style={{
                  background: navTokens.colors.gradient.center,
                  filter: 'blur(20px)',
                  opacity: 0.4,
                  borderRadius: navTokens.borderRadius.centerButton,
                }}
              />
            )}
            
            {/* Лого */}
            <Image
              src="/logo.svg"
              alt="Astrot"
              width={26}
              height={26}
              className="relative z-10 drop-shadow-md"
              style={{
                filter: 'brightness(0) invert(1)',
              }}
            />
          </div>
          <span 
            className="mt-2 text-center block"
            style={{
              fontSize: navTokens.typography.fontSize,
              fontWeight: navTokens.typography.fontWeight,
              fontFamily: navTokens.typography.fontFamily,
              color: isActive('/chart') ? navTokens.colors.text.default : navTokens.colors.text.inactive,
            }}
          >
            Карта
          </span>
          {isActive('/chart') && (
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full"
              style={{ background: navTokens.colors.gradient.active }}
            />
          )}
        </Link>

        {/* Правая кнопка - Ещё */}
        <Link
          href="/functions"
          className={`group flex flex-col items-center justify-center gap-1.5 rounded-xl px-4 py-2 transition-all active:animate-tap ${
            isActive('/functions') ? '' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <div 
            className="relative w-6 h-6"
            style={{
              background: isActive('/functions') ? navTokens.colors.gradient.active : navTokens.colors.gradient.more,
              WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='19' cy='12' r='2'/%3E%3C/svg%3E") center/contain no-repeat`,
              mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24'%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='19' cy='12' r='2'/%3E%3C/svg%3E") center/contain no-repeat`,
            }}
          />
          <span 
            className="text-center"
            style={{
              fontSize: navTokens.typography.fontSize,
              fontWeight: navTokens.typography.fontWeight,
              fontFamily: navTokens.typography.fontFamily,
              color: isActive('/functions') ? navTokens.colors.text.default : navTokens.colors.text.inactive,
            }}
          >
            Ещё
          </span>
          {isActive('/functions') && (
            <div 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full"
              style={{ background: navTokens.colors.gradient.active }}
            />
          )}
        </Link>
      </div>
    </nav>
  );
}