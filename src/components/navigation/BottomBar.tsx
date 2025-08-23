'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  route: string
  isActive: boolean
  onClick: () => void
  bgColor: string
}

function NavButton({ icon, label, route: _route, isActive, onClick, bgColor }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        transition-all duration-300 ease-out
        ${isActive ? 'scale-105' : 'scale-100'}
        active:scale-95
      `}
    >
      <div className={`
        relative w-14 h-14 rounded-full
        flex items-center justify-center
        transition-all duration-300
        ${bgColor}
        ${isActive ? 'shadow-xl shadow-purple-400/50' : 'shadow-md'}
      `}>
        <div className={`
          transition-colors duration-300
          ${isActive ? 'text-white' : 'text-white/90'}
        `}>
          {icon}
        </div>
        {isActive && (
          <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
        )}
      </div>
      <span className={`
        mt-1 text-xs font-bold transition-colors duration-300
        ${isActive ? 'text-[#7B61FF]' : 'text-gray-600'}
      `}>
        {label}
      </span>
    </button>
  )
}

interface MainButtonProps {
  route: string
  isActive: boolean
  onClick: () => void
}

function MainButton({ route: _route, isActive, onClick }: MainButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative -mt-3 transition-all duration-300 ease-out
        ${isActive ? 'scale-110' : 'scale-100'}
        active:scale-95
      `}
    >
      <div className={`
        relative w-16 h-16 rounded-full
        bg-gradient-to-br from-[#FFD6F5] to-[#D6ECFF]
        border-4 border-white
        shadow-2xl
        flex items-center justify-center
        transition-all duration-300
        ${isActive ? 'shadow-[0_0_30px_rgba(255,214,245,0.8)]' : ''}
      `}>
        <div className="relative w-10 h-10">
          <Image
            src="/logo.png"
            alt="Натальная карта"
            fill
            className="object-contain"
            priority
          />
        </div>
        {isActive && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD6F5]/30 to-[#D6ECFF]/30 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD6F5]/20 to-[#D6ECFF]/20 animate-ping" />
          </div>
        )}
      </div>
      <span className={`
        absolute -bottom-5 left-1/2 -translate-x-1/2
        text-xs font-bold whitespace-nowrap transition-colors duration-300
        ${isActive ? 'text-[#7B61FF]' : 'text-gray-600'}
      `}>
        Карта
      </span>
    </button>
  )
}

export default function BottomBar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (route: string) => {
    router.push(route)
  }

  // Иконки в мультяшном стиле
  const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )

  const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-auto max-w-screen-md">
        <div className="relative mx-4 mb-4">
          {/* Фоновый градиент бара */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-blue-100/50 rounded-full blur-xl" />
          
          {/* Основной бар */}
          <div className="relative bg-white shadow-lg rounded-full px-4 py-2 border border-purple-100/50">
            <nav className="flex items-end justify-around">
              {/* Кнопка Главная */}
              <NavButton
                icon={<HomeIcon />}
                label="Главная"
                route="/home"
                isActive={pathname === '/home' || pathname === '/'}
                onClick={() => handleNavigation('/home')}
                bgColor="bg-[#EBD8FF]"
              />

              {/* Центральная кнопка с логотипом */}
              <MainButton
                route="/natal"
                isActive={pathname === '/natal' || pathname === '/natal-chart'}
                onClick={() => handleNavigation('/natal')}
              />

              {/* Кнопка Профиль */}
              <NavButton
                icon={<SettingsIcon />}
                label="Профиль"
                route="/profile"
                isActive={pathname === '/profile'}
                onClick={() => handleNavigation('/profile')}
                bgColor="bg-[#CCF1FF]"
              />
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}