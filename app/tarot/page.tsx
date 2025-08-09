import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function TarotPage() {
  return (
    <Screen bg="functions">
      <RouteTransition routeKey="tarot">
        <div>
          <h1 className="typ-h1">Таро</h1>
          <p className="mt-4 typ-body text-on/80">Онлайн расклады скоро будут доступны.</p>
        </div>
      </RouteTransition>
    </Screen>
  );
}