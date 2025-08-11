"use client";

import { motion } from 'framer-motion';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

type TapProps = ComponentPropsWithoutRef<typeof motion.button> & {
  asChild?: boolean;
};

export const Tap = forwardRef<HTMLButtonElement, TapProps>(function Tap(
  { children, asChild = false, ...props },
  ref
) {
  const Motion = motion.button;
  return (
    <Motion
      ref={ref}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12, ease: [0.22, 0.61, 0.36, 1] }}
      {...props}
    >
      {children}
    </Motion>
  );
});