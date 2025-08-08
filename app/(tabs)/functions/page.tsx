import { AppHeader } from '@/components/ui/AppHeader';
import { Tile } from '@/components/ui/Tile';
import manifest from '@/src/config/asset_manifest.json';

const items = [
  { title: 'Натальная карта', icon: manifest.icons.natal_chart },
  { title: 'Гороскоп', icon: manifest.icons.horoscope },
  { title: 'ИИ-Астролог', icon: manifest.icons.ai_chat },
  { title: 'Таро', icon: manifest.icons.tarot },
  { title: 'Совместимость', icon: manifest.icons.compatibility },
  { title: 'Магазин', icon: manifest.icons.store }
];

export default function FunctionsTab() {
  return (
    <div>
      <AppHeader title="Функции" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        {items.map((it) => (
          <Tile key={it.title} title={it.title} icon={it.icon} />
        ))}
      </div>
    </div>
  );
}