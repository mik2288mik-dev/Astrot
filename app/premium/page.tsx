import { BottomNav } from '@/components/BottomNav';

export default function PremiumPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold">Подписка</h1>
      <div className="mt-4 grid gap-3">
        <div className="glass p-5">
          <h2 className="text-lg font-medium">Free</h2>
          <p className="opacity-80 text-sm mt-1">Неполная карта, советы.</p>
        </div>
        <div className="glass p-5">
          <h2 className="text-lg font-medium">Deepsoul+</h2>
          <p className="opacity-80 text-sm mt-1">Полная карта, транзиты, совместимость, ИИ, Таро.</p>
          <button className="mt-3 w-full py-3 rounded-2xl bg-gradient-to-r from-nebula-500 to-cosmic-600 shadow-glass">Оформить Premium</button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}