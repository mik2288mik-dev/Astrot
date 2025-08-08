import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';

const features = [
  { name: 'Полная карта', emoji: '🪐' },
  { name: 'Гороскоп', emoji: '🌌' },
  { name: 'ИИ-Астролог', emoji: '🤖' },
  { name: 'Таро', emoji: '🃏' },
  { name: 'Совместимость', emoji: '💞' },
  { name: 'Дневник', emoji: '📓' },
];

export default function FeaturesPage() {
  return (
    <Screen bg="functions">
      <RouteTransition routeKey="features">
        <div>
          <h1 className="typ-h1">Функции</h1>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {features.map((f) => (
              <Tap
                key={f.name}
                className="glass h-[168px] w-full rounded-lg p-4 flex flex-col items-start justify-end gap-2 focus:outline-none focus-visible:shadow-focus"
              >
                <span className="text-[36px] leading-none">{f.emoji}</span>
                <span className="typ-body text-left">{f.name}</span>
              </Tap>
            ))}
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}