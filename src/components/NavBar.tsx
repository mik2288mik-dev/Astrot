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
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-[72px]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center justify-center flex-1 py-2 px-3 transition-all duration-200"
            >
              <div
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-200 to-pink-200'
                    : 'group-hover:bg-neutral-50'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.icon} alt="" className="w-6 h-6" />
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-400 group-hover:text-neutral-600'
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