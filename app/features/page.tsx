import { BottomNav } from '@/components/BottomNav';

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
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold">Функции</h1>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {features.map((f) => (
          <button key={f.name} className="glass p-5 flex items-center gap-3">
            <span className="text-2xl">{f.emoji}</span>
            <span className="text-left">{f.name}</span>
          </button>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}