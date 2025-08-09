import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import Image from 'next/image';
import manifest from '@/src/config/asset_manifest.json';
import Link from 'next/link';

function resolvePublicPath(path: string): string {
  return path.startsWith('/public') ? path.replace('/public', '') : path;
}

const tiles = [
  { name: 'Natal Chart', key: 'natal_chart', href: '/natal' },
  { name: 'Horoscope', key: 'horoscope', href: '/horoscope' },
  { name: 'AI Astrologer', key: 'ai_chat', href: '/ai' },
  { name: 'Tarot', key: 'tarot', href: '/tarot' },
  { name: 'Compatibility', key: 'compatibility', href: '/compatibility' },
  { name: 'Shop', key: 'store', href: '/shop' },
];

export default function FeaturesPage() {
  return (
    <Screen bg="functions">
      <RouteTransition routeKey="features">
        <div>
          <h1 className="typ-h1">Функции</h1>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tiles.map((t) => {
              const src = resolvePublicPath(manifest.icons[t.key as keyof typeof manifest.icons]);
              return (
                <Link key={t.name} href={t.href} className="block focus:outline-none focus-visible:shadow-focus rounded-lg">
                  <Tap className="glass h-[156px] w-full rounded-lg p-4 flex flex-col items-start justify-end gap-3">
                    <div className="relative h-10 w-10">
                      <Image src={src} alt="" fill sizes="64px" className="object-contain" />
                    </div>
                    <span className="typ-body text-left">{t.name}</span>
                  </Tap>
                </Link>
              );
            })}
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}