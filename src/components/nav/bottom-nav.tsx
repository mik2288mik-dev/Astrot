"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BOTTOM_TABS } from '@/config/nav';
import { memo } from 'react';

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? 'rgb(var(--astrot-accent))' : 'currentColor';
  const size = 24;
  switch (name) {
    case 'Home':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>
      );
    case 'Chart':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3"/></svg>
      );
    case 'Heart':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      );
    case 'Dots':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill={active ? 'rgb(var(--astrot-accent))' : 'currentColor'}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
      );
    default:
      return null;
  }
}

export const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();
  return (
    <nav role="navigation" aria-label="Нижняя навигация" className="fixed bottom-0 left-0 right-0 z-50 bg-astrot-surface/95 backdrop-blur supports-[backdrop-filter]:bg-astrot-surface/85 border-t border-[color:rgb(var(--astrot-border)/0.08)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2" style={{ height: 'var(--bottom-nav-height)' }}>
        {BOTTOM_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.key} className="flex items-center justify-center">
              <Link href={tab.href} aria-label={tab.label} className="flex h-full w-full flex-col items-center justify-center text-sm text-hint aria-[current=page]:text-[rgb(var(--astrot-accent))]" aria-current={active ? 'page' : undefined} onClick={() => import('@/lib/haptics').then(m => m.impactOccurred('light')).catch(() => {})}>
                <Icon name={tab.icon} active={active} />
                <span className={active ? 'text-[rgb(var(--astrot-accent))]' : ''}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});