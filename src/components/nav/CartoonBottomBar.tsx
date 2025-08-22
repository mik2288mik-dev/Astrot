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
      {/* Многослойный эффект тени и свечения */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
        style={{
          height: '120px',
          background: 'radial-gradient(ellipse at bottom, rgba(255, 0, 110, 0.2) 0%, transparent 70%)',
          filter: 'blur(20px)',
          paddingBottom: cartoonTokens.spacing.safeAreaBottom,
        }}
      />
      <div 
        className="fixed bottom-0 left-2 right-2 z-35 pointer-events-none"
        style={{
          height: cartoonTokens.spacing.navHeight,
          background: 'linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: cartoonTokens.borderRadius.bar,
          transform: 'translateY(8px) scaleX(1.02)',
          filter: 'blur(12px)',
          paddingBottom: cartoonTokens.spacing.safeAreaBottom,
        }}
      />
      
      {/* Основной бар с СУПЕР стилем */}
      <nav 
        className="fixed bottom-0 left-2 right-2 z-50 select-none"
        style={{
          paddingBottom: cartoonTokens.spacing.safeAreaBottom,
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        {/* Фоновый слой бара с текстурой и градиентом */}
        <div
          className="relative overflow-hidden"
          style={{
            background: cartoonTokens.colors.bg.bar,
            borderRadius: cartoonTokens.borderRadius.bar,
            border: `${cartoonTokens.colors.stroke.thicknessLarge} solid ${cartoonTokens.colors.bg.barStroke}`,
            boxShadow: cartoonTokens.colors.shadows.bar,
            height: cartoonTokens.spacing.navHeight,
          }}
        >
          {/* Текстурный слой - точки */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: cartoonTokens.colors.bg.dots,
              backgroundSize: '20px 20px',
            }}
          />
          
          {/* Текстурный слой - диагональные полосы */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: cartoonTokens.colors.bg.texture,
            }}
          />
          
          {/* Облачный эффект сверху */}
          <div 
            className="absolute inset-x-0 top-0 h-1/2"
            style={{
              background: cartoonTokens.colors.bg.clouds,
            }}
          />
          
          {/* Анимированные декоративные элементы - больше эмодзи! */}
          <div className="absolute top-1 left-4 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌟</div>
          <div className="absolute top-2 left-20 text-2xl animate-swing">💫</div>
          <div className="absolute top-3 right-20 text-2xl animate-cartoon-float" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute top-1 right-4 text-3xl animate-jiggle" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute bottom-2 left-1/2 text-xl animate-cartoon-pulse" style={{ animationDelay: '0.7s' }}>🌈</div>
          
          {/* Контейнер для кнопок */}
          <div className="relative flex items-center justify-between h-full px-6">
            
            {/* Левая кнопка - Главная (как персонаж) */}
            <Link
              href="/"
              className={`group relative flex flex-col items-center justify-center transition-all ${
                isActive('/') ? 'animate-cartoon-wobble' : ''
              } hover:scale-110 active:animate-cartoon-tap`}
              style={{
                width: cartoonTokens.spacing.sideButtonSize,
                height: cartoonTokens.spacing.sideButtonSize,
              }}
            >
              {/* Многослойный фон кнопки */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: isActive('/') 
                    ? cartoonTokens.colors.gradients.home 
                    : `linear-gradient(145deg, ${cartoonTokens.colors.primary.pink} 0%, ${cartoonTokens.colors.primary.coral} 100%)`,
                  border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.stroke.black}`,
                  boxShadow: isActive('/') 
                    ? cartoonTokens.colors.shadows.glow
                    : cartoonTokens.colors.shadows.bubble,
                  transform: 'rotate(-5deg)',
                }}
              />
              
              {/* Внутренний блик */}
              <div 
                className="absolute inset-2 rounded-full opacity-50"
                style={{
                  background: cartoonTokens.colors.gradients.shine,
                }}
              />
              
              {/* Иконка с тенью */}
              <DoodleHomeIcon className="relative z-10 w-8 h-8 text-white mb-1 drop-shadow-lg" />
              
              {/* Подпись с обводкой */}
              <span 
                className="relative z-10 font-cartoon"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.label,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  color: 'white',
                  textShadow: `2px 2px 0 ${cartoonTokens.colors.stroke.black}, -1px -1px 0 ${cartoonTokens.colors.stroke.black}`,
                }}
              >
                Home
              </span>
              
              {/* Супер активный индикатор */}
              {isActive('/') && (
                <>
                  <div className="absolute -top-3 -right-3 text-3xl animate-bounce">
                    🔥
                  </div>
                  <div className="absolute inset-0 rounded-full animate-glow-pulse pointer-events-none" />
                </>
              )}
            </Link>

            {/* ЦЕНТРАЛЬНАЯ СУПЕР-КНОПКА - Astrot Logo */}
            <Link
              href="/chart"
              className="absolute left-1/2 -translate-x-1/2 group"
              style={{
                top: '-20px', // Еще больше выступает
              }}
            >
              <div 
                className={`relative flex items-center justify-center transition-all ${
                  isActive('/chart') ? 'animate-cartoon-pulse' : 'animate-cartoon-float'
                } hover:scale-115 active:animate-cartoon-tap`}
                style={{
                  width: cartoonTokens.spacing.centerButtonSize,
                  height: cartoonTokens.spacing.centerButtonSize,
                }}
              >
                {/* Супер-фон с радужным градиентом */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: cartoonTokens.colors.gradients.rainbow,
                    borderRadius: cartoonTokens.borderRadius.centerButton,
                    border: `${cartoonTokens.colors.stroke.thicknessLarge} solid ${cartoonTokens.colors.stroke.black}`,
                    boxShadow: cartoonTokens.colors.shadows.glow,
                    animation: 'rotate360 15s linear infinite',
                  }}
                />
                
                {/* Внутренний круг с градиентом */}
                <div 
                  className="absolute inset-2"
                  style={{
                    background: cartoonTokens.colors.gradients.center,
                    borderRadius: cartoonTokens.borderRadius.centerButton,
                    border: `${cartoonTokens.colors.stroke.thicknessSmall} solid white`,
                  }}
                />
                
                {/* Блик и сияние */}
                <div 
                  className="absolute inset-3"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 60%)',
                    borderRadius: cartoonTokens.borderRadius.centerButton,
                  }}
                />
                
                {/* Пульсирующее свечение */}
                {isActive('/chart') && (
                  <div 
                    className="absolute -inset-4 animate-pulse"
                    style={{
                      background: cartoonTokens.colors.gradients.glow,
                      filter: 'blur(20px)',
                      borderRadius: cartoonTokens.borderRadius.centerButton,
                    }}
                  />
                )}
                
                {/* Супер-лого с анимацией */}
                <DoodleAstrotLogo className="relative z-10 w-full h-full p-1" />
                
                {/* Орбитальные элементы вокруг */}
                {isActive('/chart') && (
                  <>
                    <div className="absolute -top-4 -left-4 text-2xl animate-bounce">🚀</div>
                    <div className="absolute -top-3 -right-4 text-2xl animate-swing" style={{ animationDelay: '0.3s' }}>🌟</div>
                    <div className="absolute -bottom-3 -left-3 text-xl animate-cartoon-float" style={{ animationDelay: '0.6s' }}>💫</div>
                    <div className="absolute -bottom-4 -right-3 text-xl animate-jiggle" style={{ animationDelay: '0.9s' }}>⚡</div>
                  </>
                )}
              </div>
              
              {/* Подпись под кнопкой с супер-стилем */}
              <span 
                className="mt-3 block text-center font-cartoon animate-cartoon-pulse"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.centerLabel,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  background: cartoonTokens.colors.gradients.center,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                }}
              >
                ASTROT
              </span>
            </Link>

            {/* Правая кнопка - Ещё (как персонаж) */}
            <Link
              href="/functions"
              className={`group relative flex flex-col items-center justify-center transition-all ${
                isActive('/functions') ? 'animate-cartoon-wobble' : ''
              } hover:scale-110 active:animate-cartoon-tap`}
              style={{
                width: cartoonTokens.spacing.sideButtonSize,
                height: cartoonTokens.spacing.sideButtonSize,
              }}
            >
              {/* Многослойный фон кнопки */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: isActive('/functions') 
                    ? cartoonTokens.colors.gradients.more
                    : `linear-gradient(145deg, ${cartoonTokens.colors.primary.cyan} 0%, ${cartoonTokens.colors.primary.blue} 100%)`,
                  border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.stroke.black}`,
                  boxShadow: isActive('/functions') 
                    ? cartoonTokens.colors.shadows.glow
                    : cartoonTokens.colors.shadows.bubble,
                  transform: 'rotate(5deg)',
                }}
              />
              
              {/* Внутренний блик */}
              <div 
                className="absolute inset-2 rounded-full opacity-50"
                style={{
                  background: cartoonTokens.colors.gradients.shine,
                }}
              />
              
              {/* Иконка с тенью */}
              <DoodleMoreIcon className="relative z-10 w-8 h-8 text-white mb-1 drop-shadow-lg" />
              
              {/* Подпись с обводкой */}
              <span 
                className="relative z-10 font-cartoon"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.label,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  color: 'white',
                  textShadow: `2px 2px 0 ${cartoonTokens.colors.stroke.black}, -1px -1px 0 ${cartoonTokens.colors.stroke.black}`,
                }}
              >
                More
              </span>
              
              {/* Супер активный индикатор */}
              {isActive('/functions') && (
                <>
                  <div className="absolute -top-3 -left-3 text-3xl animate-bounce">
                    ⚡
                  </div>
                  <div className="absolute inset-0 rounded-full animate-glow-pulse pointer-events-none" />
                </>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}