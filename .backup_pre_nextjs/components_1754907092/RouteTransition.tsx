"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

export function RouteTransition({ children, routeKey }: { children: ReactNode; routeKey: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{
          opacity: { duration: 0.22, ease: [0.22, 0.61, 0.36, 1] },
          y: { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}