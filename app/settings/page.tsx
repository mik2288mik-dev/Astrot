import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';

export default function SettingsPage() {
  return (
    <Screen bg="profile">
      <RouteTransition routeKey="settings">
        <div>
          <h1 className="typ-h1">Профиль</h1>
          <div className="mt-4 glass p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/10" />
              <div>
                <div className="font-medium">Имя из Telegram</div>
                <div className="typ-caption text-on/70">@username</div>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <button className="bg-white/5 rounded-md p-3 text-left focus:outline-none focus-visible:shadow-focus">Изменить дату рождения</button>
              <button className="bg-white/5 rounded-md p-3 text-left focus:outline-none focus-visible:shadow-focus">Изменить место рождения</button>
              <button className="bg-white/5 rounded-md p-3 text-left focus:outline-none focus-visible:shadow-focus">Поделиться картой</button>
            </div>
          </div>
        </div>
      </RouteTransition>
    </Screen>
  );
}