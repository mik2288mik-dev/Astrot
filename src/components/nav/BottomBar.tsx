'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  SparklesIcon,
  ChartBarIcon,
  UserCircleIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  SparklesIcon as SparklesIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  Squares2X2Icon as Squares2X2IconSolid
} from '@heroicons/react/24/solid';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconActive: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Главная',
    icon: HomeIcon,
    iconActive: HomeIconSolid
  },
  {
    href: '/horoscope',
    label: 'Гороскоп',
    icon: SparklesIcon,
    iconActive: SparklesIconSolid
  },
  {
    href: '/chart',
    label: 'Карта',
    icon: ChartBarIcon,
    iconActive: ChartBarIconSolid
  },
  {
    href: '/profile',
    label: 'Профиль',
    icon: UserCircleIcon,
    iconActive: UserCircleIconSolid
  },
  {
    href: '/functions',
    label: 'Ещё',
    icon: Squares2X2Icon,
    iconActive: Squares2X2IconSolid
  }
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = isActive ? item.iconActive : item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                isActive 
                  ? 'text-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}