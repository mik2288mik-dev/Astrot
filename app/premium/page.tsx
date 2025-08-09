import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';

export default function PremiumPage() {
  return (
    <Screen bg="subscription">
      <RouteTransition routeKey="premium">
        <div>
          <h1 className="typ-h1">Подписка</h1>
          <div className="mt-4 grid gap-3">
            <div className="glass p-6 rounded-lg">
              <h2 className="typ-title">Бесплатно</h2>
              <ul className="typ-body text-on/80 mt-2 list-disc pl-5 space-y-1">
                <li>Превью натальной карты</li>
                <li>Еженедельные советы</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-lg border border-gold/40">
              <h2 className="typ-title text-gold">Deepsoul+</h2>
              <ul className="typ-body text-on/80 mt-2 list-disc pl-5 space-y-1">
                <li>Полная натальная карта</li>
                <li>Личные транзиты и прогноз</li>
                <li>Совместимость</li>
                <li>ИИ-Астролог и Таро</li>
              </ul>
              <Tap className="mt-4 w-full h-12 rounded-md pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">Оформить</Tap>
            </div>
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}