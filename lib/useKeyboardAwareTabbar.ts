"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * Hides the tabbar by translating it down when the on-screen keyboard is visible.
 * Logic: if visual viewport height shrinks by more than 120px, we consider the keyboard open.
 */
export function useKeyboardAwareTabbar(): string {
  const baselineRef = useRef<number | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;

    const handleResize = () => {
      if (baselineRef.current === null) baselineRef.current = Math.max(vv.height || 0, window.innerHeight || 0);
      const baseline = baselineRef.current || 0;
      const current = vv.height || 0;
      const delta = baseline - current;
      setHidden(delta > 120);
    };

    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);
    handleResize();
    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    };
  }, []);

  return hidden ? 'translate-y-[120%] transition-transform duration-200' : 'translate-y-0 transition-transform duration-200';
}