"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type MotionButtonProps = React.ComponentProps<typeof motion.button>;

type Props = Omit<MotionButtonProps, 'ref' | 'children'> & {
  title: string;
  caption?: string;
  icon?: string;
  className?: string;
};

export function Tile({ title, caption, icon, className, ...rest }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'bg-surface rounded-lg shadow-card p-4 text-left grid content-start gap-3',
        'min-h-[160px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        className
      )}
      {...rest}
    >
      {icon && (
        <span
          className="icon-mask"
          style={{ WebkitMaskImage: `url(${icon})`, maskImage: `url(${icon})`, width: 36, height: 36 }}
          aria-hidden
        />
      )}
      <div>
        <div className="text-[16px] leading-[22px] font-semibold text-on">{title}</div>
        {caption && <div className="text-[13px] leading-[18px] text-muted mt-1">{caption}</div>}
      </div>
    </motion.button>
  );
}