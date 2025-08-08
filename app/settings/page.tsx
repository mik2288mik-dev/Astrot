import { BottomNav } from '@/components/BottomNav';

export default function SettingsPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold">Профиль</h1>
      <div className="mt-4 glass p-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white/10" />
          <div>
            <div className="font-medium">Имя из Telegram</div>
            <div className="text-sm opacity-80">@username</div>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <button className="bg-white/5 rounded-xl p-3 text-left">Изменить дату рождения</button>
          <button className="bg-white/5 rounded-xl p-3 text-left">Изменить место рождения</button>
          <button className="bg-white/5 rounded-xl p-3 text-left">Поделиться картой</button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}