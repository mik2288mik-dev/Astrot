import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import Link from 'next/link';
import Image from 'next/image';

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
            <h1 className="typ-h1 flex items-center gap-2">
              <Image src="/logo.png" alt="" width={18} height={18} className="opacity-70 grayscale" />
              Astrot Premium
            </h1>
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
              <Tap className="mt-4 w-full h-12 rounded-xl text-white bg-grad-accent shadow-[0_8px_24px_rgba(161,107,254,0.35)] focus:outline-none focus-visible:shadow-focus">Оформить подписку</Tap>
            </Link>
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}