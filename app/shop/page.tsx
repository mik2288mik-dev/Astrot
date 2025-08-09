import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function ShopPage() {
  return (
    <Screen bg="functions">
      <RouteTransition routeKey="shop">
        <div>
          <h1 className="typ-h1">Магазин</h1>
          <p className="mt-4 typ-body text-on/80">Эксклюзивные товары и подписки скоро здесь.</p>
        </div>
      </RouteTransition>
    </Screen>
  );
}