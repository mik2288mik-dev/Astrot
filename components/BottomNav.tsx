"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { impactLight } from '@/lib/haptics';

const tabs = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/features', label: 'Functions', icon: '✨' },
  { href: '/premium', label: 'Subscription', icon: '💎' },
  { href: '/settings', label: 'Profile', icon: '👤' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom">
      <div className="mx-auto max-w-lg px-4 pb-2">
        <div className="glass h-16 rounded-xl px-2 flex items-center justify-between">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => impactLight()}
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-transform',
                  isActive ? 'text-white' : 'text-muted'
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'text-[28px] leading-none',
                    isActive ? 'bg-clip-text text-transparent pastel-gradient' : ''
                  )}
                >
                  {tab.icon}
                </span>
                <span className="sr-only">{tab.label}</span>
                {isActive && (
                  <span className="pointer-events-none absolute -top-1 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(178,141,255,0.75)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}