"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import NatalForm from '@/components/NatalForm';

export default function NatalFormPage() {
  return (
    <Screen bg="home">
      <RouteTransition routeKey="natal-module">
        <div className="glass p-6 grid gap-4">
          <h1 className="typ-h1">Натальная карта</h1>
          <p className="typ-body text-on/80">Бесплатно — базовые расчёты. Премиум — дневной гороскоп и расшифровка ИИ.</p>
          <NatalForm />
        </div>
      </RouteTransition>
    </Screen>
  );
}