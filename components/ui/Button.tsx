"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'L' | 'M' | 'S';

type MotionButtonProps = React.ComponentProps<typeof motion.button>;

type Props = Omit<MotionButtonProps, 'ref'> & { variant?: ButtonVariant; size?: ButtonSize };

const sizeMap: Record<ButtonSize, string> = {
  L: 'h-12 min-w-[120px] px-5 rounded-md', // 48px, radius md(12)
  M: 'h-11 min-w-[88px] px-4 rounded-md',  // 44px
  S: 'h-10 min-w-[72px] px-4 rounded-md'   // 40px
};

function baseClasses(variant: ButtonVariant): string {
  if (variant === 'primary') {
    return 'text-[#0A0A12] bg-[image:var(--grad-pastel)] shadow-card';
  }
  if (variant === 'secondary') {
    return 'text-on bg-surface border border-primary/60 shadow-card';
  }
  return 'text-on bg-transparent hover:bg-white/6 active:bg-white/8';
}

export function Button({
  children,
  variant = 'primary',
  size = 'L',
  className,
  ...rest
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        sizeMap[size],
        baseClasses(variant),
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

// CSS variable for gradient to avoid tailwind purge issues
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  root.style.setProperty('--grad-pastel', 'linear-gradient(135deg, #B28DFF 0%, #FF8BD1 50%, #60D6FF 100%)');
}