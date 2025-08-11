import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function AIPage() {
  return (
    <Screen bg="functions">
      <RouteTransition routeKey="ai">
        <div>
          <h1 className="typ-h1">ИИ-Астролог</h1>
          <p className="mt-4 typ-body text-on/80">Скоро здесь будет чат с вашим персональным астрологом.</p>
        </div>
      </RouteTransition>
    </Screen>
  );
}