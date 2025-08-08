import { BottomNav } from '@/components/BottomNav';

export default function HomePage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <section className="glass p-5">
        <h1 className="text-2xl font-semibold">Твой космос</h1>
        <p className="mt-2 text-sm opacity-90">Быстрый доступ к последней натальной карте. Нажми, чтобы открыть полную версию.</p>
        <div className="mt-4 h-40 rounded-2xl bg-white/5 flex items-center justify-center text-white/80">
          Превью вашей карты
        </div>
        <button className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-nebula-500 to-cosmic-600 shadow-glass">Открыть полную карту</button>
      </section>

      <section className="mt-6 glass p-5">
        <h2 className="text-lg font-medium">Что узнаешь</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm opacity-90">
          <li className="bg-white/5 rounded-xl p-3">Личностные черты</li>
          <li className="bg-white/5 rounded-xl p-3">Сильные стороны</li>
          <li className="bg-white/5 rounded-xl p-3">Совместимость</li>
          <li className="bg-white/5 rounded-xl p-3">Транзиты</li>
        </ul>
      </section>

      <BottomNav />
    </div>
  );
}