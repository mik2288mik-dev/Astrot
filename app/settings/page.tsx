"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { useTelegram } from '@/app/telegram-context';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useTelegram();
  const fullName = user ? [user.first_name, user.last_name].filter(Boolean).join(' ') : 'Имя из Telegram';
  const username = user?.username ? `@${user.username}` : '@username';
  const photo = user?.photo_url;
  const id = user?.id ? `ID: ${user.id}` : undefined;

  return (
    <Screen bg="profile">
      <RouteTransition routeKey="settings">
        <div>
          <h1 className="typ-h1">Настройки</h1>
          <div className="mt-4 glass p-6 rounded-lg">
            <div className="flex items-center gap-4">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={fullName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white" />
              )}
              <div>
                <div className="font-medium">{fullName}</div>
                <div className="typ-caption text-on/70">{username}</div>
                {id && <div className="typ-caption text-on/50 mt-0.5">{id}</div>}
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <Link href="#" className="bg-white/70 rounded-md p-3 text-left focus:outline-none focus-visible:shadow-focus">Notifications</Link>
              <Link href="#" className="bg-white/70 rounded-md p-3 text-left focus:outline-none focus-visible:shadow-focus">Privacy</Link>
              <Link href="#" className="bg-white/70 rounded-md p-3 text-left focus:outline-none focus-visible:shadow-focus">Help</Link>
            </div>
          </div>

          <button className="mt-6 w-full h-12 rounded-xl bg-gold/90 text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">Log Out</button>
        </div>
      </RouteTransition>
    </Screen>
  );
}