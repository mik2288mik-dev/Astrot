"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import { useTelegram } from '@/app/telegram-context';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useTelegram();
  const firstName = user?.first_name;

  return (
    <Screen bg="home">
      <RouteTransition routeKey="home">
        <div>
          <section className="glass p-6">
            <h1 className="typ-h1">{firstName ? `Добро пожаловать, ${firstName}` : 'Добро пожаловать'}</h1>
            <p className="mt-2 typ-body text-on/90">Мини-превью натальной карты. Нажми, чтобы открыть полную версию.</p>
            <div className="mt-4 h-40 rounded-xl bg-surface flex items-center justify-center text-on/70">
              Превью вашей карты
            </div>
            <Link href="/natal" className="block mt-4">
              <Tap className="w-full h-12 rounded-md pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">Подробнее</Tap>
            </Link>
          </section>

          <section className="mt-6 glass p-6">
            <h2 className="typ-title">Что узнаешь</h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 typ-body text-on/90">
              <li className="bg-white/60 rounded-md p-3">Личностные черты</li>
              <li className="bg-white/60 rounded-md p-3">Сильные стороны</li>
              <li className="bg-white/60 rounded-md p-3">Совместимость</li>
              <li className="bg-white/60 rounded-md p-3">Транзиты</li>
            </ul>
          </section>
        </div>
      </RouteTransition>
    </Screen>
  );
}