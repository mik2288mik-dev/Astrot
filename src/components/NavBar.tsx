'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    <nav className="tabbar">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`item ${isActive ? 'active' : ''}`}
          >
            <div className="icon-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.icon}
                alt=""
                className="w-6 h-6"
                style={{ 
                  filter: isActive 
                    ? 'brightness(0) saturate(100%) invert(37%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(95%) contrast(97%)' 
                    : 'none' 
                }}
              />
            </div>
            <span>{item.label}</span>
            {isActive && <div className="dot" />}
          </Link>
        );
      })}
    </nav>
  );
}
