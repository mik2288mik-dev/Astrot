"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * Returns true when on-screen keyboard is likely open (iOS/Android webview) based on visualViewport shrink.
 * - Uses a threshold of 120px by default, as requested.
 * - Adds focusin/focusout listeners as a fallback signal.
 */
export function useKeyboardAwareTabbar(threshold = 120): boolean {
  const baselineRef = useRef<number | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;

    const onResize = () => {
      if (!vv) return;
      if (baselineRef.current === null) baselineRef.current = Math.max(vv.height || 0, window.innerHeight || 0);
      const baseline = baselineRef.current || 0;
      const current = vv.height || 0;
      const delta = baseline - current;
      const kbOpen = delta > threshold || (window.innerHeight - current > threshold);
      setHidden(kbOpen);
    };

    vv?.addEventListener?.('resize', onResize);
    vv?.addEventListener?.('scroll', onResize);

    // Fallback: focus events often correlate with keyboard visibility
    window.addEventListener('focusin', onResize);
    window.addEventListener('focusout', onResize);

    onResize();
    return () => {
      vv?.removeEventListener?.('resize', onResize);
      vv?.removeEventListener?.('scroll', onResize);
      window.removeEventListener('focusin', onResize);
      window.removeEventListener('focusout', onResize);
    };
  }, [threshold]);

  return hidden;
}