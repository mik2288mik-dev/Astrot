'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DoodleHomeIcon, DoodleMoreIcon } from '@/components/icons/DoodleIcons';
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
      {/* Мягкая тень под баром */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
        style={{
          height: '40px',
          background: 'linear-gradient(to top, rgba(160, 124, 255, 0.03) 0%, transparent 100%)',
          paddingBottom: cartoonTokens.spacing.safeAreaBottom,
        }}
      />
      
      {/* Основной бар - премиум мультяшный стиль */}
      <nav 
        className="fixed bottom-0 left-3 right-3 z-50 select-none"
        style={{
          paddingBottom: cartoonTokens.spacing.safeAreaBottom,
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        {/* Фоновый слой бара с мягким градиентом */}
        <div
          className="relative overflow-hidden"
          style={{
            background: cartoonTokens.colors.bg.bar,
            borderRadius: cartoonTokens.borderRadius.bar,
            border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.stroke.white}`,
            boxShadow: cartoonTokens.colors.shadows.bar,
            height: cartoonTokens.spacing.navHeight,
          }}
        >
          {/* Лёгкая текстура муар */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: cartoonTokens.colors.bg.muar,
              backgroundSize: '100px 100px',
            }}
          />
          
          {/* Облачный эффект сверху */}
          <div 
            className="absolute inset-x-0 top-0 h-2/3"
            style={{
              background: cartoonTokens.colors.bg.clouds,
            }}
          />
          
          {/* Минималистичные декоративные элементы */}
          <div 
            className="absolute top-4 left-8"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: cartoonTokens.colors.primary.lavender,
              opacity: 0.6,
            }}
          />
          <div 
            className="absolute top-6 right-10"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: cartoonTokens.colors.primary.peach,
              opacity: 0.5,
            }}
          />
          
          {/* Контейнер для кнопок */}
          <div className="relative flex items-center justify-between h-full px-8">
            
            {/* Левая кнопка - Главная (стикер-стиль) */}
            <Link
              href="/"
              className={`group relative flex flex-col items-center justify-center transition-all duration-200 ${
                isActive('/') ? 'scale-105' : ''
              } hover:scale-110 active:scale-95`}
              style={{
                width: cartoonTokens.spacing.sideButtonSize,
                height: cartoonTokens.spacing.sideButtonSize,
              }}
            >
              {/* Фон кнопки-стикера */}
              <div 
                className="absolute inset-0"
                style={{
                  background: isActive('/') 
                    ? cartoonTokens.colors.gradients.home 
                    : cartoonTokens.colors.primary.pink,
                  borderRadius: cartoonTokens.borderRadius.sticker,
                  border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.stroke.white}`,
                  boxShadow: isActive('/') 
                    ? cartoonTokens.colors.shadows.glow
                    : cartoonTokens.colors.shadows.sticker,
                }}
              />
              
              {/* Блик */}
              <div 
                className="absolute inset-1 opacity-40"
                style={{
                  background: cartoonTokens.colors.gradients.shine,
                  borderRadius: cartoonTokens.borderRadius.sticker,
                }}
              />
              
              {/* Иконка */}
              <DoodleHomeIcon className="relative z-10 w-6 h-6 text-white mb-0.5" />
              
              {/* Подпись */}
              <span 
                className="relative z-10 font-cartoon"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.label,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                Главная
              </span>
              
              {/* Активный индикатор - точка */}
              {isActive('/') && (
                <div 
                  className="absolute -top-1 -right-1"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: cartoonTokens.colors.primary.purple,
                    border: `2px solid white`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              )}
            </Link>

            {/* ЦЕНТРАЛЬНАЯ КНОПКА - Logo Astrot */}
            <Link
              href="/chart"
              className="absolute left-1/2 -translate-x-1/2 group"
              style={{
                top: '-12px', // Немного выступает за пределы
              }}
            >
              <div 
                className={`relative flex items-center justify-center transition-all duration-200 ${
                  isActive('/chart') ? 'scale-105' : ''
                } hover:scale-110 active:scale-95`}
                style={{
                  width: cartoonTokens.spacing.centerButtonSize,
                  height: cartoonTokens.spacing.centerButtonSize,
                }}
              >
                {/* Фон центральной кнопки с градиентом */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: cartoonTokens.colors.gradients.center,
                    borderRadius: cartoonTokens.borderRadius.centerButton,
                    border: `${cartoonTokens.colors.stroke.thicknessLarge} solid ${cartoonTokens.colors.stroke.white}`,
                    boxShadow: isActive('/chart')
                      ? cartoonTokens.colors.shadows.glow
                      : cartoonTokens.colors.shadows.button,
                  }}
                />
                
                {/* Внутренний круг с бликом */}
                <div 
                  className="absolute inset-1"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 50%)',
                    borderRadius: cartoonTokens.borderRadius.centerButton,
                  }}
                />
                
                {/* Мягкое свечение при активности */}
                {isActive('/chart') && (
                  <div 
                    className="absolute -inset-2 animate-pulse"
                    style={{
                      background: cartoonTokens.colors.gradients.glow,
                      filter: 'blur(12px)',
                      borderRadius: cartoonTokens.borderRadius.centerButton,
                      opacity: 0.5,
                    }}
                  />
                )}
                
                {/* Logo Astrot */}
                <div className="relative z-10 w-12 h-12 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Astrot"
                    width={40}
                    height={40}
                    className="drop-shadow-sm"
                    priority
                  />
                </div>
              </div>
              
              {/* Подпись под кнопкой */}
              <span 
                className="mt-2 block text-center font-cartoon"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.centerLabel,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  color: cartoonTokens.colors.primary.purple,
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                }}
              >
                Карта
              </span>
            </Link>

            {/* Правая кнопка - Ещё (стикер-стиль) */}
            <Link
              href="/functions"
              className={`group relative flex flex-col items-center justify-center transition-all duration-200 ${
                isActive('/functions') ? 'scale-105' : ''
              } hover:scale-110 active:scale-95`}
              style={{
                width: cartoonTokens.spacing.sideButtonSize,
                height: cartoonTokens.spacing.sideButtonSize,
              }}
            >
              {/* Фон кнопки-стикера */}
              <div 
                className="absolute inset-0"
                style={{
                  background: isActive('/functions') 
                    ? cartoonTokens.colors.gradients.more
                    : cartoonTokens.colors.primary.blue,
                  borderRadius: cartoonTokens.borderRadius.sticker,
                  border: `${cartoonTokens.colors.stroke.thickness} solid ${cartoonTokens.colors.stroke.white}`,
                  boxShadow: isActive('/functions') 
                    ? cartoonTokens.colors.shadows.glow
                    : cartoonTokens.colors.shadows.sticker,
                }}
              />
              
              {/* Блик */}
              <div 
                className="absolute inset-1 opacity-40"
                style={{
                  background: cartoonTokens.colors.gradients.shine,
                  borderRadius: cartoonTokens.borderRadius.sticker,
                }}
              />
              
              {/* Иконка */}
              <DoodleMoreIcon className="relative z-10 w-6 h-6 text-white mb-0.5" />
              
              {/* Подпись */}
              <span 
                className="relative z-10 font-cartoon"
                style={{
                  fontSize: cartoonTokens.typography.fontSize.label,
                  fontWeight: cartoonTokens.typography.fontWeight,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                Ещё
              </span>
              
              {/* Активный индикатор - точка */}
              {isActive('/functions') && (
                <div 
                  className="absolute -top-1 -right-1"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: cartoonTokens.colors.primary.purple,
                    border: `2px solid white`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}