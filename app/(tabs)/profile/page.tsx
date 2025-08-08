import { AppHeader } from '@/components/ui/AppHeader';
import { Input } from '@/components/ui/Input';

export default function ProfileTab() {
  return (
    <div>
      <AppHeader title="Профиль" />
      <div className="mt-4 bg-surface rounded-lg shadow-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white/10" />
          <div>
            <div className="font-medium">Имя из Telegram</div>
            <div className="text-sm text-muted">@username</div>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <Input label="Дата рождения" placeholder="ДД.ММ.ГГГГ" />
          <Input label="Место рождения" placeholder="Город, страна" />
        </div>
      </div>
    </div>
  );
}