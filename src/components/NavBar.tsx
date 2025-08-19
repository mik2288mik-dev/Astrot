'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, Squares2X2Icon, ChatBubbleLeftRightIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, Squares2X2Icon as Squares2X2IconSolid, ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: HomeIcon, activeIcon: HomeIconSolid },
  { href: '/functions', label: 'Functions', icon: Squares2X2Icon, activeIcon: Squares2X2IconSolid },
  { href: '/chat', label: 'Chat', icon: ChatBubbleLeftRightIcon, activeIcon: ChatBubbleLeftRightIconSolid },
  { href: '/profile', label: 'Profile', icon: UserIcon, activeIcon: UserIconSolid },
];

export default function NavBar() {
  const pathname = usePathname();

  // Показываем все 4 вкладки
  const mainNavItems = navItems;

  return (
    <nav className="tabbar">
      {mainNavItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const IconComponent = isActive ? item.activeIcon : item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`item ${isActive ? 'active' : ''}`}
          >
            <div className="icon-wrapper">
              <IconComponent className="w-6 h-6" />
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
