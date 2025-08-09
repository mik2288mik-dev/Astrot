import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function CompatibilityPage() {
  return (
    <Screen bg="functions">
      <RouteTransition routeKey="compatibility">
        <div>
          <h1 className="typ-h1">Совместимость</h1>
          <p className="mt-4 typ-body text-on/80">Проверка совместимости скоро появится.</p>
        </div>
      </RouteTransition>
    </Screen>
  );
}