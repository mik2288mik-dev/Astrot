"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <Screen bg="home">
      <RouteTransition routeKey="home">
        <div className="space-y-6">
          <header className="text-center">
            <div className="mx-auto h-14 w-14 relative">
              <Image src="/logo.png" alt="Astrot" fill sizes="56px" className="object-contain" priority />
            </div>
            <h1 className="mt-4 typ-h1 text-gradient-soft">Добро пожаловать в Astrot</h1>
            <p className="mt-2 typ-body text-on/80 max-w-md mx-auto">
              Твое личное пространство для астрологии, где каждая звезда говорит с тобой. Открой свою натальную карту и узнай, что звёзды подготовили именно для тебя. Получай точные прогнозы, советы астролога и рекомендации, основанные на твоём уникальном космическом коде.
            </p>
          </header>

          <section className="glass p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="typ-title">Натальная карта</h2>
                <p className="mt-1 typ-caption text-on/70">Открой свою карту и начни путешествие</p>
              </div>
              <Link href="/natal">
                <Tap className="h-10 px-4 rounded-md pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">Открыть</Tap>
              </Link>
            </div>
            <div className="mt-4 h-40 rounded-xl bg-surface flex items-center justify-center text-on/70 border border-gray-200/60">
              Превью вашей карты
            </div>
          </section>

          <section className="glass p-6">
            <h2 className="typ-title">Совет астролога на сегодня</h2>
            <p className="mt-2 typ-body text-on/90">
              Сегодня удели внимание деталям и простым ритуалам. Маленькие шаги дадут заметный результат, если сохранять спокойный ритм и доверять своей интуиции.
            </p>
          </section>

          <section className="glass p-6">
            <h2 className="typ-title">Что узнаешь</h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 typ-body text-on/90">
              <li className="bg-white/60 rounded-md p-3 border border-gray-200/60">Сильные и слабые стороны</li>
              <li className="bg-white/60 rounded-md p-3 border border-gray-200/60">Скрытые таланты</li>
              <li className="bg-white/60 rounded-md p-3 border border-gray-200/60">Совместимость</li>
              <li className="bg-white/60 rounded-md p-3 border border-gray-200/60">Транзиты и прогноз</li>
            </ul>
          </section>

          <section className="glass p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="typ-title">Astrot Premium</h2>
                <p className="typ-caption text-on/70">Раскрой больше — персональные прогнозы и расшифровки ИИ</p>
              </div>
              <Link href="/premium">
                <Tap className="h-10 px-4 rounded-md pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">Подробнее</Tap>
              </Link>
            </div>
          </section>
        </div>
      </RouteTransition>
    </Screen>
  );
}