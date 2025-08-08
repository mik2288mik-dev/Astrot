"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const tabs = [
  { href: '/', label: 'Главная', icon: '🏠' },
  { href: '/features', label: 'Функции', icon: '✨' },
  { href: '/premium', label: 'Подписка', icon: '💎' },
  { href: '/settings', label: 'Профиль', icon: '👤' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom">
      <div className="mx-auto max-w-lg p-3">
        <div className="glass grid grid-cols-4 gap-2 p-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
            return (
              <Link key={tab.href} href={tab.href} className={cn(
                'flex flex-col items-center py-2 rounded-xl transition-colors',
                isActive ? 'bg-white/10' : 'hover:bg-white/5'
              )}>
                <span className="text-xl leading-none">{tab.icon}</span>
                <span className="text-[11px] mt-1 opacity-90">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}