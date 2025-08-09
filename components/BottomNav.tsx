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
  { href: '/', label: 'Главная', iconKey: 'home' as const },
  { href: '/natal', label: 'Карта', iconKey: 'natal_chart' as const },
  { href: '/premium', label: 'Премиум', iconKey: 'subscription' as const },
  { href: '/compatibility', label: 'Совместимость', iconKey: 'compatibility' as const },
  { href: '/journal', label: 'Дневник', iconKey: 'journal' as const },
];

export function BottomNav() {
  const pathname = usePathname() || '';

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom">
      <div className="mx-auto max-w-lg px-4 pb-2">
        <div className="glass h-16 rounded-xl px-1 flex items-center justify-between">
          {tabs.map(({ href, label, iconKey }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            const src = resolvePublicPath((manifest as any).icons[iconKey]);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => impactLight()}
                className={cn(
                  'relative flex flex-col items-center justify-center h-14 w-14 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-transform',
                  isActive ? 'text-on' : 'text-muted'
                )}
                aria-label={label}
              >
                <div className="relative h-6 w-6">
                  <Image src={src} alt="" fill sizes="24px" className={cn('object-contain opacity-80', isActive ? 'opacity-100' : '')} />
                </div>
                <span className={cn('mt-1 text-[11px] leading-none', isActive ? 'text-on' : 'text-muted')}>{label}</span>
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