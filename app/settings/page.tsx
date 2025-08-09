"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { useTelegram } from '@/app/telegram-context';

export default function SettingsPage() {
  const { user } = useTelegram();
  const fullName = user ? [user.first_name, user.last_name].filter(Boolean).join(' ') : 'Имя из Telegram';
  const username = user?.username ? `@${user.username}` : '@username';
  const photo = user?.photo_url;
  const id = user?.id ? `ID: ${user.id}` : undefined;
  const lang = user?.language_code ? `Язык: ${user.language_code}` : undefined;

  return (
    <Screen bg="profile">
      <RouteTransition routeKey="settings">
        <div>
          <h1 className="typ-h1">Профиль</h1>
          <div className="mt-4 glass p-6 rounded-lg">
            <div className="flex items-center gap-4">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={fullName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/10" />
              )}
              <div>
                <div className="font-medium">{fullName}</div>
                <div className="typ-caption text-on/70">{username}</div>
                {(id || lang) && (
                  <div className="typ-caption text-on/50 mt-0.5">{[id, lang].filter(Boolean).join(' · ')}</div>
                )}
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