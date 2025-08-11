import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function NotFound() {
  return (
    <Screen bg="loading">
      <RouteTransition routeKey="not-found">
        <div className="text-center py-20">
          <h1 className="typ-h1">Страница не найдена</h1>
          <p className="typ-body text-on/80 mt-2">Проверь адрес или вернись на главную.</p>
        </div>
      </RouteTransition>
    </Screen>
  );
}