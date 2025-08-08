"use client";

import manifest from '@/src/config/asset_manifest.json';
import { ReactNode, useMemo } from 'react';

type BackgroundKey = keyof typeof manifest.backgrounds;

function resolvePublicPath(path: string): string {
  // Manifest uses /public/... but Next serves from /...
  return path.startsWith('/public') ? path.replace('/public', '') : path;
}

export function Screen({ bg, children }: { bg: BackgroundKey; children: ReactNode }) {
  const src = useMemo(() => resolvePublicPath(manifest.backgrounds[bg]), [bg]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 scrim"
        style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {children}
    </div>
  );
}