import { cn } from '@/lib/cn';
import React from 'react';

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium',
        'bg-button text-button-text hover:opacity-95 active:opacity-90',
        'transition-colors duration-150',
        className
      )}
      {...props}
    />
  );
}