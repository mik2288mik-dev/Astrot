"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/config/nav';
import { memo } from 'react';
import { motion } from 'framer-motion';

export const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      role="navigation"
      aria-label="Нижняя навигация"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[rgb(var(--astrot-surface))] border-t border-[color:rgb(var(--astrot-border)/0.08)] shadow-md"
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
                    onTapStart={() => import('@/lib/haptics').then((m) => m.impactOccurred('light')).catch(() => {})}
                    className="w-14 h-14 rounded-full bg-[rgb(var(--astrot-accent))] text-white flex items-center justify-center shadow-md"
                    style={{ transform: 'translateY(-12px)' }}
                  >
                    {/* Planet icon: simple emoji fallback for now */}
                    <span className="text-2xl">🪐</span>
                  </motion.div>
                </Link>
              </li>
            );
          }
          const IconCmp = tab.icon as any;
          return (
            <li key={tab.key} className="flex items-center justify-center">
              <Link
                href={tab.href}
                aria-label={tab.label}
                className="flex h-full w-full flex-col items-center justify-center text-xs"
                aria-current={active ? 'page' : undefined}
                onClick={() => import('@/lib/haptics').then((m) => m.impactOccurred('light')).catch(() => {})}
              >
                {typeof IconCmp === 'function' ? (
                  <IconCmp size={20} stroke={1.8} className={active ? 'text-[rgb(var(--astrot-accent))]' : 'text-astrot-muted'} />
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