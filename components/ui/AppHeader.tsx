"use client";

import Link from 'next/link';
import { cn } from '@/lib/cn';

export function AppHeader({
  title,
  backHref,
  rightIcon,
  onRightClick
}: {
  title?: string;
  backHref?: string;
  rightIcon?: React.ReactNode;
  onRightClick?: () => void;
}) {
  return (
    <header className="h-14 grid grid-cols-3 items-center px-4" role="banner">
      <div className="justify-self-start">
        {backHref && (
          <Link href={backHref} className="h-10 w-10 grid place-items-center rounded-md hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-accent/60">
            <span aria-hidden>←</span>
            <span className="sr-only">Назад</span>
          </Link>
        )}
      </div>
      <div className={cn('justify-self-center text-center', !title && 'opacity-0')}> 
        {title && <div className="text-[18px] leading-[24px] font-semibold">{title}</div>}
      </div>
      <div className="justify-self-end">
        {rightIcon && (
          <button onClick={onRightClick} className="h-10 w-10 grid place-items-center rounded-md hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-accent/60">
            {rightIcon}
            <span className="sr-only">Действие</span>
          </button>
        )}
      </div>
    </header>
  );
}