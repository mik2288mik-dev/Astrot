'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Главная', icon: '/assets/deepsoul/home.svg' },
  { href: '/functions', label: 'Функции', icon: '/assets/deepsoul/functions.svg' },
  { href: '/chat', label: 'Чат', icon: '/assets/deepsoul/chat.svg' },
  { href: '/profile', label: 'Профиль', icon: '/assets/deepsoul/profile.svg' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-xl border-t border-white/20 z-50 shadow-nav text-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-[72px] px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center justify-center flex-1 py-2 px-2 transition-all duration-200 rounded-xl hover:bg-white/10"
            >
              <div
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.icon} 
                  alt="" 
                  className={`w-6 h-6 transition-all duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                  }`} 
                />
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/70 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}