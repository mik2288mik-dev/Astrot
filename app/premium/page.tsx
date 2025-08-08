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
              <h2 className="typ-title">Free</h2>
              <p className="typ-body text-on/80 mt-1">Неполная карта, советы.</p>
            </div>
            <div className="glass p-6 rounded-lg border border-gold/30">
              <h2 className="typ-title text-gold">Deepsoul+</h2>
              <p className="typ-body text-on/80 mt-1">Полная карта, транзиты, совместимость, ИИ, Таро.</p>
              <Tap className="mt-3 w-full h-12 rounded-md pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">Оформить Premium</Tap>
            </div>
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}