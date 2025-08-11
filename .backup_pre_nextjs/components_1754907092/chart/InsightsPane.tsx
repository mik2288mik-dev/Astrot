import { ChartData } from './ChartViewport';
import { signNameRu } from './utils';

export default function InsightsPane({ data, onFocusItem }: { data: ChartData; onFocusItem: (key: string | null) => void }) {
  const bullets: { id: string; text: string }[] = [];
  const sun = data.planets.find((p) => p.name.toLowerCase() === 'sun');
  if (sun) bullets.push({ id: 'Sun', text: `Солнце в ${signNameRu(sun.lon)}` });
  const moon = data.planets.find((p) => p.name.toLowerCase() === 'moon');
  if (moon) bullets.push({ id: 'Moon', text: `Луна в ${signNameRu(moon.lon)}` });
  if (data.houses) bullets.push({ id: 'ASC', text: `Асцендент: ${signNameRu(data.houses.asc)}` });
  if (data.aspects && data.aspects.length) bullets.push({ id: 'Aspects', text: `Аспектов: ${data.aspects.length}` });

  while (bullets.length < 4) bullets.push({ id: `i${bullets.length}`, text: 'Личные качества — фокус на сильных сторонах.' });

  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        {bullets.slice(0, 6).map((b) => (
          <button
            key={b.id}
            onClick={() => onFocusItem(b.id === 'Aspects' ? null : b.id)}
            className="text-left px-3 py-2 rounded-xl bg-white/60 hover:bg-white/80 border border-gray-200/60 typ-caption"
          >
            {b.text}
          </button>
        ))}
      </div>
    </div>
  );
}