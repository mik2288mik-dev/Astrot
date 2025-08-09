"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { impactLight } from '@/lib/haptics';
import Image from 'next/image';
import manifest from '@/src/config/asset_manifest.json';

function resolvePublicPath(path: string): string {
  return path.startsWith('/public') ? path.replace('/public', '') : path;
}

const tabs = [
  { href: '/', label: 'Home', iconKey: 'home' as const },
  { href: '/functions', label: 'Functions', iconKey: 'functions' as const },
  { href: '/subscription', label: 'Subscription', iconKey: 'subscription' as const },
  { href: '/profile', label: 'Profile', iconKey: 'profile' as const },
];

export function BottomNav() {
  const pathname = usePathname() || '';

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom">
      <div className="mx-auto max-w-lg px-4 pb-2">
        <div className="glass h-16 rounded-xl px-2 flex items-center justify-between">
          {tabs.map(({ href, label, iconKey }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            const src = resolvePublicPath((manifest as any).icons[iconKey]);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => impactLight()}
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-transform',
                  isActive ? 'text-on' : 'text-muted'
                )}
                aria-label={label}
              >
                <div className="relative h-7 w-7">
                  <Image src={src} alt="" fill sizes="32px" className={cn('object-contain opacity-80', isActive ? 'opacity-100' : '')} />
                </div>
                {isActive && (
                  <span className="pointer-events-none absolute -top-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}