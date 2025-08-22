'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
        className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none h-10"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.02) 0%, transparent 100%)',
        }}
      />
      
      {/* Основной бар */}
      <nav className="fixed bottom-0 left-3 right-3 z-50 pb-safe">
        <div className="relative bg-white rounded-[24px] shadow-lg border border-gray-100 h-[72px] overflow-hidden">
          {/* Градиентный фон */}
          <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 opacity-50" />
          
          {/* Контейнер для кнопок */}
          <div className="relative flex items-center justify-between h-full px-8">
            
            {/* Левая кнопка - Главная */}
            <Link
              href="/"
              className={`group flex flex-col items-center justify-center transition-all duration-300 ${
                isActive('/') ? 'scale-105' : ''
              } hover:scale-110 active:scale-95`}
              style={{ width: '56px', height: '56px' }}
            >
              <div 
                className={`relative w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] shadow-md' 
                    : 'bg-gray-100'
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive('/') ? 'text-white' : 'text-[#666666]'}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={`mt-1 text-[12px] font-medium ${isActive('/') ? 'text-[#2C2C2C]' : 'text-[#666666]'}`}>
                Главная
              </span>
            </Link>

            {/* ЦЕНТРАЛЬНАЯ КНОПКА - Logo */}
            <Link
              href="/chart"
              className="absolute left-1/2 -translate-x-1/2 -top-2 group"
            >
              <div 
                className={`relative w-[64px] h-[64px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive('/chart') ? 'scale-105' : ''
                } hover:scale-110 active:scale-95`}
                style={{
                  background: 'linear-gradient(135deg, #FDCBFF 0%, #B3CFFF 100%)',
                  boxShadow: isActive('/chart')
                    ? '0 8px 24px rgba(183, 148, 246, 0.4), 0 0 20px rgba(183, 148, 246, 0.3)'
                    : '0 4px 16px rgba(183, 148, 246, 0.3)',
                }}
              >
                {/* Внутренний блик */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                
                {/* Свечение при активности */}
                {isActive('/chart') && (
                  <div 
                    className="absolute -inset-2 rounded-full animate-pulse"
                    style={{
                      background: 'radial-gradient(circle, rgba(183, 148, 246, 0.3) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                    }}
                  />
                )}
                
                {/* Logo */}
                <div className="relative z-10 w-10 h-10 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Astrot"
                    width={36}
                    height={36}
                    className="drop-shadow-sm"
                    priority
                  />
                </div>
              </div>
              
              {/* Подпись под кнопкой */}
              <span className="mt-2 block text-center text-[12px] font-semibold text-[#2C2C2C]">
                Карта
              </span>
            </Link>

            {/* Правая кнопка - Функции */}
            <Link
              href="/functions"
              className={`group flex flex-col items-center justify-center transition-all duration-300 ${
                isActive('/functions') ? 'scale-105' : ''
              } hover:scale-110 active:scale-95`}
              style={{ width: '56px', height: '56px' }}
            >
              <div 
                className={`relative w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-300 ${
                  isActive('/functions') 
                    ? 'bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] shadow-md' 
                    : 'bg-gray-100'
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isActive('/functions') ? 'text-white' : 'text-[#666666]'}>
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className={`mt-1 text-[12px] font-medium ${isActive('/functions') ? 'text-[#2C2C2C]' : 'text-[#666666]'}`}>
                Функции
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}