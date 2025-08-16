'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  SparklesIcon as SparklesIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserCircleIcon as UserCircleIconSolid
} from '@heroicons/react/24/solid';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Главная',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    href: '/functions',
    label: 'Функции',
    icon: SparklesIcon,
    activeIcon: SparklesIconSolid,
  },
  {
    href: '/chat',
    label: 'Чат',
    icon: ChatBubbleLeftRightIcon,
    activeIcon: ChatBubbleLeftRightIconSolid,
  },
  {
    href: '/profile',
    label: 'Профиль',
    icon: UserCircleIcon,
    activeIcon: UserCircleIconSolid,
  },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-100 z-50">
      <div className="flex items-center justify-around h-[72px] pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = isActive ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2 px-3 transition-all duration-200 group"
            >
              <div className={`
                p-2 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-br from-primary-100 to-primary-50' 
                  : 'group-hover:bg-neutral-50'
                }
              `}>
                <Icon 
                  className={`
                    w-6 h-6 transition-all duration-200
                    ${isActive 
                      ? 'text-primary-600' 
                      : 'text-neutral-400 group-hover:text-neutral-600'
                    }
                  `} 
                />
              </div>
              <span 
                className={`
                  text-xs mt-1 font-medium transition-all duration-200
                  ${isActive 
                    ? 'text-primary-600' 
                    : 'text-neutral-400 group-hover:text-neutral-600'
                  }
                `}
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