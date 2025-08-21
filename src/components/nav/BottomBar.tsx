'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  Cog6ToothIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid, 
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid, 
  UserIcon as UserIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid
} from '@heroicons/react/24/solid';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { 
    href: '/', 
    label: 'Главная', 
    icon: HomeIcon, 
    activeIcon: HomeIconSolid 
  },
  { 
    href: '/horoscope', 
    label: 'Гороскоп', 
    icon: CalendarDaysIcon, 
    activeIcon: CalendarDaysIconSolid 
  },
  { 
    href: '/settings', 
    label: 'Настройки', 
    icon: Cog6ToothIcon, 
    activeIcon: Cog6ToothIconSolid 
  },
  { 
    href: '/chat', 
    label: 'Чат', 
    icon: ChatBubbleLeftRightIcon, 
    activeIcon: ChatBubbleLeftRightIconSolid 
  },
  { 
    href: '/profile', 
    label: 'Профиль', 
    icon: UserIcon, 
    activeIcon: UserIconSolid 
  },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="tabbar" role="navigation" aria-label="Основная навигация">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const IconComponent = isActive ? item.activeIcon : item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`item ${isActive ? 'active' : ''}`}
            aria-label={`${item.label}${isActive ? ' (текущая страница)' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="icon-wrapper">
              <IconComponent className="w-6 h-6" aria-hidden="true" />
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}