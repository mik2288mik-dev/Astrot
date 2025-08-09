"use client";

import manifest from '@/src/config/asset_manifest.json';
import { ReactNode, useMemo } from 'react';
import Image from 'next/image';

type BackgroundKey = keyof typeof manifest.backgrounds;

function resolvePublicPath(path: string): string {
  return path.startsWith('/public') ? path.replace('/public', '') : path;
}

export function Screen({ bg, children }: { bg: BackgroundKey; children: ReactNode }) {
  const src = useMemo(() => resolvePublicPath(manifest.backgrounds[bg]), [bg]);

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <Image src={src} alt="" aria-hidden fill sizes="100vw" className="object-cover" priority={bg === 'home'} />
        <div aria-hidden className="scrim absolute inset-0" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(230,214,255,0.10), rgba(198,230,245,0.08))' }} />
      {children}
    </div>
  );
}