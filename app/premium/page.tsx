import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import Link from 'next/link';

const benefits = [
  'Полная натальная карта с расширенными интерпретациями',
  'Дневные и недельные персональные прогнозы',
  'ИИ-астролог: разбор твоих вопросов на основе твоего космического кода',
  'Совместимость: романтика, дружба, работа',
  'Дневник событий с астрологическими подсказками',
  'Таро-наводки и рекомендации к дню',
  'Приоритетная поддержка',
];

export default function PremiumPage() {
  return (
    <Screen bg="subscription">
      <RouteTransition routeKey="premium">
        <div className="space-y-4">
          <div className="glass p-6">
            <h1 className="typ-h1">Astrot Premium</h1>
            <p className="mt-2 typ-body text-on/80">
              Смарт-подписка для тех, кто хочет видеть глубже и действовать увереннее. Всё важное — в одном месте.
            </p>
          </div>

          <div className="glass p-6">
            <h2 className="typ-title">Что входит</h2>
            <ul className="mt-3 typ-body text-on/90 list-disc pl-5 space-y-1">
              {benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Link href="/subscription">
              <Tap className="mt-4 w-full h-12 rounded-md pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">Оформить подписку</Tap>
            </Link>
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}