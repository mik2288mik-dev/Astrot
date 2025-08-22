'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Settings } from 'lucide-react'

interface NavItem {
  href: string
  icon?: React.ReactNode
  label: string
  isCenter?: boolean
}

export default function BottomBar() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      href: '/',
      icon: <Home className="w-6 h-6" strokeWidth={3} />,
      label: 'Главная'
    },
    {
      href: '/natal-chart',
      label: 'Карта',
      isCenter: true
    },
    {
      href: '/profile',
      icon: <Settings className="w-6 h-6" strokeWidth={3} />,
      label: 'Профиль'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl rounded-t-3xl">
        <nav className="flex items-end justify-around px-4 pt-2 pb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            if (item.isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative -mt-8 group"
                >
                  <div className={`
                    flex flex-col items-center justify-center
                    w-20 h-20 rounded-full
                    bg-gradient-to-br from-purple-500 to-pink-500
                    shadow-xl transform transition-all duration-300
                    ${isActive ? 'scale-110 shadow-2xl' : 'hover:scale-105'}
                    group-active:scale-95
                  `}>
                    <div className="relative w-12 h-12">
                      <Image
                        src="/logo.png"
                        alt="Натальная карта"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                  <span className={`
                    absolute -bottom-6 left-1/2 -translate-x-1/2
                    text-xs font-bold whitespace-nowrap
                    ${isActive ? 'text-purple-600' : 'text-gray-600'}
                  `}>
                    {item.label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center
                  py-2 px-4 rounded-2xl
                  transition-all duration-300
                  ${isActive 
                    ? 'text-purple-600 scale-105' 
                    : 'text-gray-500 hover:text-purple-500'
                  }
                  active:scale-95
                `}
              >
                <div className={`
                  p-2 rounded-xl transition-colors duration-300
                  ${isActive ? 'bg-purple-100' : 'hover:bg-purple-50'}
                `}>
                  {item.icon}
                </div>
                <span className={`
                  text-xs font-bold mt-1
                  ${isActive ? 'text-purple-600' : 'text-gray-600'}
                `}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}