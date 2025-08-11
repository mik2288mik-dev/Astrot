import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function CompatibilityPage() {
  return (
    <Screen bg="functions">
      <RouteTransition routeKey="compatibility">
        <div className="glass p-6">
          <h1 className="typ-h1">Совместимость</h1>
          <p className="mt-2 typ-body text-on/80">
            Введи данные рождения собеседника, и Astrot покажет, что вас ждёт — от первой встречи до долгосрочных отношений.
          </p>
        </div>
      </RouteTransition>
    </Screen>
  );
}