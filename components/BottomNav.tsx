"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import manifest from '@/src/config/asset_manifest.json';
import { cn } from '@/lib/cn';

const tabs = [
  { href: '/home', key: 'home', label: 'Home', icon: manifest.icons.home },
  { href: '/functions', key: 'functions', label: 'Functions', icon: manifest.icons.functions },
  { href: '/subscription', key: 'subscription', label: 'Subscription', icon: manifest.icons.subscription },
  { href: '/profile', key: 'profile', label: 'Profile', icon: manifest.icons.profile }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom" aria-label="Основная навигация">
      <div className="mx-auto max-w-lg px-3">
        <div className="h-16 grid grid-cols-4 items-center rounded-xl bg-surface/70 backdrop-blur-md border border-white/10 shadow-card px-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== '/home' && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'relative flex flex-col items-center justify-center py-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
                  'min-h-[44px]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={cn(
                    'icon-mask',
                    isActive ? '' : 'opacity-60'
                  )}
                  style={{ WebkitMaskImage: `url(${tab.icon})`, maskImage: `url(${tab.icon})` }}
                  aria-hidden
                />
                {/* labels off by default; enable if needed */}
                {/* <span className="text-[11px] leading-[14px] font-semibold mt-1 text-muted">{tab.label}</span> */}
                {isActive && (
                  <span className="absolute -top-1 h-1 w-1.5 rounded-full bg-primary blur-[2px]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}