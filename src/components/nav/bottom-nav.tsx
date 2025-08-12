"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/config/nav';
import { memo } from 'react';
import { motion } from 'framer-motion';

// Define a minimal icon component type to avoid using `any` while matching Tabler icons' props we use
type IconComponent = (props: { size?: number; stroke?: number; className?: string }) => JSX.Element;

export const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();
  return (
          <nav
        role="navigation"
        aria-label="Нижняя навигация"
        className="fixed bottom-0 left-0 right-0 z-50 bg-[rgb(var(--astrot-surface))] border-t border-[color:rgb(var(--astrot-muted)/0.24)] shadow-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
      <ul className="relative mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-2" style={{ height: 'var(--bottom-nav-height)' }}>
        {NAV_ITEMS.map((tab) => {
          const active = pathname === tab.href;
          if (tab.isCenter) {
            return (
              <li key={tab.key} className="flex items-center justify-center">
                <Link href={tab.href} aria-label="Открыть карту" className="relative block">
                  <motion.div
                    initial={false}
                    whileTap={{ scale: 0.95 }}
                    onTapStart={() => import('@/lib/haptics').then((m) => m.impactOccurred('medium')).catch(() => {})}
                    className="relative w-16 h-16 rounded-full bg-[rgb(var(--astrot-accent))] text-white flex items-center justify-center shadow-md drop-shadow-lg z-10 transition-transform duration-150 hover:scale-105 active:scale-95"
                    style={{ transform: 'translateY(-12px)' }}
                  >
                    {/* Planet icon: emoji fallback always present, SVG overlays if available */}
                    <span className="text-2xl" aria-hidden>🪐</span>
                    {/* eslint-disable @next/next/no-img-element */}
                    <img src="/logo.svg" alt="Astrot" className="w-7 h-7 absolute" />
                  </motion.div>
                </Link>
              </li>
            );
          }
          const IconCmp: IconComponent | null = typeof tab.icon === 'function' ? (tab.icon as IconComponent) : null;
          return (
            <li key={tab.key} className="flex items-center justify-center">
                              <Link
                  href={tab.href}
                  aria-label={tab.label}
                  className="flex h-full w-full flex-col items-center justify-center text-xs transition-transform transition-colors duration-150 hover:scale-[1.05] active:scale-[0.95]"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => import('@/lib/haptics').then((m) => m.impactOccurred('light')).catch(() => {})}
                >
                {IconCmp ? (
                  <IconCmp size={24} stroke={1.5} className={active ? 'text-[rgb(var(--astrot-accent))]' : 'text-astrot-muted'} />
                ) : null}
                <span className={active ? 'text-[rgb(var(--astrot-accent))]' : 'text-astrot-muted'}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});