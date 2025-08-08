import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';

export default function SubscriptionTab() {
  return (
    <div>
      <AppHeader title="Подписка" />

      <div className="mt-4 grid gap-3">
        <div className="bg-surface rounded-lg shadow-card p-6">
          <h2 className="text-[18px] leading-[24px] font-semibold">Free</h2>
          <ul className="mt-3 text-[13px] leading-[18px] text-muted list-disc pl-5 space-y-1">
            <li>Неполная карта</li>
            <li>Советы по дням</li>
          </ul>
        </div>

        <div className="bg-surface rounded-lg shadow-card p-6">
          <h2 className="text-[18px] leading-[24px] font-semibold">Deepsoul+</h2>
          <ul className="mt-3 text-[13px] leading-[18px] text-on/90 list-disc pl-5 space-y-1">
            <li>Полная карта</li>
            <li>Транзиты</li>
            <li>Совместимость</li>
            <li>ИИ-Астролог и Таро</li>
          </ul>
          <Button className="mt-4 w-full">Оформить Premium</Button>
        </div>
      </div>
    </div>
  );
}