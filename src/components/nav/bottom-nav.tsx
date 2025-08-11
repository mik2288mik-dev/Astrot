"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/config/nav';
import { memo } from 'react';

export const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();
  return (
    <nav role="navigation" aria-label="Нижняя навигация" className="fixed bottom-0 left-0 right-0 z-50 bg-astrot-surface/95 backdrop-blur supports-[backdrop-filter]:bg-astrot-surface/85 border-t border-[color:rgb(var(--astrot-border)/0.08)] shadow-md" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2" style={{ height: 'var(--bottom-nav-height)' }}>
        {NAV_ITEMS.map((tab) => {
          const active = pathname === tab.href;
          const IconCmp = tab.icon;
          return (
            <li key={tab.key} className="flex items-center justify-center">
              <Link href={tab.href} aria-label={tab.label} className="flex h-full w-full flex-col items-center justify-center text-xs text-astrot-muted" aria-current={active ? 'page' : undefined} onClick={() => import('@/lib/haptics').then(m => m.impactOccurred('light')).catch(() => {})}>
                <IconCmp size={24} stroke={1.8} className={active ? 'text-[rgb(var(--astrot-accent))]' : 'text-astrot-muted'} />
                <span className={active ? 'text-[rgb(var(--astrot-accent))]' : ''}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});