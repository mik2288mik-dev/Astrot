"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function JournalPage() {
  return (
    <Screen bg="functions">
      <RouteTransition routeKey="journal">
        <div className="glass p-6">
          <h1 className="typ-h1">Дневник</h1>
          <p className="mt-2 typ-body text-on/80">
            Записывай события своей жизни, а Astrot будет связывать их с движением планет и подсказывать, как лучше действовать.
          </p>
        </div>
      </RouteTransition>
    </Screen>
  );
}