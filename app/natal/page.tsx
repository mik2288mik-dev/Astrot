"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import NatalForm from '@/components/NatalForm';

export default function NatalFormPage() {
  return (
    <Screen bg="home">
      <RouteTransition routeKey="natal-module">
        <div className="min-h-[70dvh] flex items-center justify-center px-4 py-10">
          <div className="glass w-full max-w-xl p-6 sm:p-8 grid gap-4">
            <h1 className="typ-h1 text-gradient-soft">Натальная карта</h1>
            <p className="typ-body text-on/80">Бесплатно — базовые расчёты. Премиум — дневной гороскоп и расшифровка ИИ.</p>
            <NatalForm />
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}