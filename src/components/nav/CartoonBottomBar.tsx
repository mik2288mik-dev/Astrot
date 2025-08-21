'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DoodleHomeIcon, DoodleMoreIcon, DoodleAstrotLogo } from '@/components/icons/DoodleIcons';
import { cartoonTokens } from '@/styles/cartoon-tokens';

export default function CartoonBottomBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  if (!mounted) return null;

  return (
    <>
      {/* Слой тени под баром для эффекта стикера */}
      <div 
        className="fixed bottom-0 left-4 right-4 z-40 pointer-events-none"
        style={{
          height: cartoonTokens.spacing.navHeight,
          background: 'rgba(147, 51, 234, 0.1)',
          borderRadius: cartoonTokens.borderRadius.bar,
          transform: 'translateY(4px)',
          filter: 'blur(8px)',
          paddingBottom: cartoonTokens.spacing.safeAreaBottom,
        }}
      />
      
      {/* Основной бар */}
      <nav 
        className="fixed bottom-0 left-2 right-2 z-50 select-none"
        style={{
          paddingBottom: cartoonTokens.spacing.safeAreaBottom,
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        {/* Фоновый слой бара с обводкой */}
        <div
          className="relative"
          style={{
            background: cartoonTokens.colors.bg.bar,
            borderRadius: cartoonTokens.borderRadius.bar,
            border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.bg.barStroke}`,
            boxShadow: cartoonTokens.colors.shadows.bar,
            height: cartoonTokens.spacing.navHeight,
          }}
        >
          {/* Декоративные элементы - звездочки */}
          <div className="absolute top-2 left-6 text-2xl animate-cartoon-float">✨</div>
          <div className="absolute top-3 right-8 text-xl animate-cartoon-float" style={{ animationDelay: '1s' }}>⭐</div>
          
          {/* Контейнер для кнопок */}
          <div className="relative flex items-center justify-between h-full px-6">
            
            {/* Левая кнопка - Главная */}
            <Link
              href="/"
              className={`group relative flex flex-col items-center justify-center transition-all ${
                isActive('/') ? 'animate-cartoon-wobble' : ''
              } hover:scale-105 active:animate-cartoon-tap`}
              style={{
                width: cartoonTokens.spacing.sideButtonSize,
                height: cartoonTokens.spacing.sideButtonSize,
              }}
            >
              {/* Фон кнопки */}
              <div 
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: isActive('/') ? cartoonTokens.colors.gradients.home : cartoonTokens.colors.primary.pink,
                  border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.stroke.white}`,
                  boxShadow: isActive('/') 
                    ? cartoonTokens.colors.shadows.buttonActive 
                    : cartoonTokens.colors.shadows.button,
                  transform: 'rotate(-3deg)',
                }}
              />
              
              {/* Иконка */}
              <DoodleHomeIcon className="relative z-10 w-7 h-7 text-white mb-1" />
              
              {/* Подпись */}
              <span 
                className="relative z-10 text-white font-cartoon"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.label,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                Главная
              </span>
              
              {/* Активный индикатор */}
              {isActive('/') && (
                <div className="absolute -top-2 -right-2 text-2xl animate-cartoon-pulse">
                  💫
                </div>
              )}
            </Link>

            {/* Центральная кнопка - Карта (Лого) */}
            <Link
              href="/chart"
              className="absolute left-1/2 -translate-x-1/2 group"
              style={{
                top: '-10px', // Выступает за пределы бара
              }}
            >
              <div 
                className={`relative flex flex-col items-center justify-center transition-all ${
                  isActive('/chart') ? 'animate-cartoon-pulse' : ''
                } hover:scale-110 active:animate-cartoon-tap`}
                style={{
                  width: cartoonTokens.spacing.centerButtonSize,
                  height: cartoonTokens.spacing.centerButtonSize,
                }}
              >
                {/* Фон кнопки с мультицветным градиентом */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: cartoonTokens.colors.gradients.center,
                    borderRadius: cartoonTokens.borderRadius.centerButton,
                    border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.stroke.white}`,
                    boxShadow: isActive('/chart') 
                      ? cartoonTokens.colors.shadows.glow
                      : cartoonTokens.colors.shadows.button,
                    transform: 'rotate(5deg)',
                  }}
                />
                
                {/* Дополнительный слой для эффекта пузыря */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent)',
                    borderRadius: cartoonTokens.borderRadius.centerButton,
                  }}
                />
                
                {/* Glow эффект */}
                {isActive('/chart') && (
                  <div 
                    className="absolute inset-0 animate-pulse"
                    style={{
                      background: cartoonTokens.colors.gradients.center,
                      filter: 'blur(20px)',
                      opacity: 0.5,
                      borderRadius: cartoonTokens.borderRadius.centerButton,
                      transform: 'scale(1.2)',
                    }}
                  />
                )}
                
                {/* Лого */}
                <DoodleAstrotLogo className="relative z-10 w-10 h-10" />
                
                {/* Декоративные элементы вокруг */}
                {isActive('/chart') && (
                  <>
                    <div className="absolute -top-3 -left-3 text-lg animate-cartoon-float">⭐</div>
                    <div className="absolute -bottom-2 -right-3 text-lg animate-cartoon-float" style={{ animationDelay: '0.5s' }}>✨</div>
                  </>
                )}
              </div>
              
              {/* Подпись под кнопкой */}
              <span 
                className="mt-2 block text-center font-cartoon"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.centerLabel,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  color: cartoonTokens.colors.primary.purple,
                  textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                }}
              >
                Карта
              </span>
            </Link>

            {/* Правая кнопка - Ещё */}
            <Link
              href="/functions"
              className={`group relative flex flex-col items-center justify-center transition-all ${
                isActive('/functions') ? 'animate-cartoon-wobble' : ''
              } hover:scale-105 active:animate-cartoon-tap`}
              style={{
                width: cartoonTokens.spacing.sideButtonSize,
                height: cartoonTokens.spacing.sideButtonSize,
              }}
            >
              {/* Фон кнопки */}
              <div 
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: isActive('/functions') ? cartoonTokens.colors.gradients.more : cartoonTokens.colors.primary.cyan,
                  border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.stroke.white}`,
                  boxShadow: isActive('/functions') 
                    ? cartoonTokens.colors.shadows.buttonActive 
                    : cartoonTokens.colors.shadows.button,
                  transform: 'rotate(3deg)',
                }}
              />
              
              {/* Иконка */}
              <DoodleMoreIcon className="relative z-10 w-7 h-7 text-white mb-1" />
              
              {/* Подпись */}
              <span 
                className="relative z-10 text-white font-cartoon"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.label,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                Ещё
              </span>
              
              {/* Активный индикатор */}
              {isActive('/functions') && (
                <div className="absolute -top-2 -left-2 text-2xl animate-cartoon-pulse">
                  🌟
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}