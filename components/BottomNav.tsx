"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { impactLight } from '@/lib/haptics';
import { SVGProps } from 'react';

function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 9.5V19a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9.5" strokeLinecap="round" />
    </svg>
  );
}

function IconGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  );
}

function IconDiamond(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3l4 4 5 1-9 13L3 8l5-1 4-4Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" strokeLinecap="round" />
    </svg>
  );
}

const tabs = [
  { href: '/', label: 'Home', Icon: IconHome },
  { href: '/features', label: 'Functions', Icon: IconGrid },
  { href: '/premium', label: 'Subscription', Icon: IconDiamond },
  { href: '/settings', label: 'Profile', Icon: IconUser },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom">
      <div className="mx-auto max-w-lg px-4 pb-2">
        <div className="glass h-16 rounded-xl px-2 flex items-center justify-between">
          {tabs.map(({ href, label, Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => impactLight()}
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-transform',
                  isActive ? 'text-white' : 'text-muted'
                )}
              >
                <Icon
                  width={28}
                  height={28}
                  className={cn('opacity-80', isActive ? 'opacity-100 drop-shadow-[0_0_8px_rgba(178,141,255,0.35)]' : '')}
                />
                <span className="sr-only">{label}</span>
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