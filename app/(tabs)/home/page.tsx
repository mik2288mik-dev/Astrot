import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';

export default function HomeTab() {
  return (
    <div>
      <AppHeader title="Твой космос" />
      <section className="mt-4 bg-surface rounded-lg shadow-card p-6">
        <h1 className="text-[22px] leading-[28px] font-semibold">Последняя карта</h1>
        <p className="mt-2 text-[13px] leading-[18px] text-muted">Открой полную версию для глубокого анализа.</p>
        <div className="mt-4 h-40 rounded-lg bg-white/5 grid place-items-center text-on/80">
          Превью вашей карты
        </div>
        <Button className="mt-4 w-full">Открыть полную карту</Button>
      </section>

      <section className="mt-4 bg-surface rounded-lg shadow-card p-6">
        <h2 className="text-[18px] leading-[24px] font-semibold">Что узнаешь</h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <li className="bg-white/5 rounded-md p-3">Личностные черты</li>
          <li className="bg-white/5 rounded-md p-3">Сильные стороны</li>
          <li className="bg-white/5 rounded-md p-3">Совместимость</li>
          <li className="bg-white/5 rounded-md p-3">Транзиты</li>
        </ul>
      </section>
    </div>
  );
}