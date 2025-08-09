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
            <h1 className="typ-h1 text-gradient-soft">Полная карта</h1>
            <p className="typ-body text-on/80">
              Перед тобой карта, которая отражает твои сильные и слабые стороны, скрытые таланты и жизненные вызовы. Используй её как компас для принятия важных решений.
            </p>
            <NatalForm />
            <div className="mt-2 grid grid-cols-2 gap-2 typ-caption text-on/70">
              <div className="bg-white/60 rounded-md p-3 border border-gray-200/60">Личностные черты</div>
              <div className="bg-white/60 rounded-md p-3 border border-gray-200/60">Таланты и ресурсы</div>
              <div className="bg-white/60 rounded-md p-3 border border-gray-200/60">Жизненные вызовы</div>
              <div className="bg-white/60 rounded-md p-3 border border-gray-200/60">Транзиты и цикл года</div>
            </div>
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}