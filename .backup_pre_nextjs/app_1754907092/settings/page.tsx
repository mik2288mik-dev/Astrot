"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { useTelegram } from '@/app/telegram-context';
import Link from 'next/link';
import Image from 'next/image';

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
          <h1 className="typ-h1 flex items-center gap-2">
            <Image src="/logo.png" alt="" width={18} height={18} className="opacity-70 grayscale" />
            Настройки
          </h1>
          <div className="mt-4 glass p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={fullName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white" />
              )}
              <div>
                <div className="font-semibold">{fullName}</div>
                <div className="typ-caption text-on/70">{username}</div>
                {id && <div className="typ-caption text-on/50 mt-0.5">{id}</div>}
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <Link href="#" className="bg-white/70 hover:bg-white/80 rounded-2xl p-3 text-left focus:outline-none focus-visible:shadow-focus">Уведомления</Link>
              <Link href="#" className="bg-white/70 hover:bg-white/80 rounded-2xl p-3 text-left focus:outline-none focus-visible:shadow-focus">Приватность</Link>
              <Link href="#" className="bg-white/70 hover:bg-white/80 rounded-2xl p-3 text-left focus:outline-none focus-visible:shadow-focus">Помощь</Link>
            </div>
          </div>

          <button className="mt-6 w-full h-12 rounded-full text-white bg-grad-accent shadow-[0_8px_24px_rgba(161,107,254,0.35)] font-semibold focus:outline-none focus-visible:shadow-focus">Выйти</button>
        </div>
      </RouteTransition>
    </Screen>
  );
}