"use client";

import { motion } from 'framer-motion';
import { useTelegram } from '@/providers/telegram-provider';
import Image from 'next/image';

export function ProfileCard() {
  const { initDataUnsafe } = useTelegram();
  type User = { id?: number; username?: string; first_name?: string; last_name?: string };
  type InitData = { user?: User } | null;
  const init = (initDataUnsafe ?? null) as InitData;
  const user = init?.user ?? {};
  const username = user.username ?? '';
  const firstName = user.first_name ?? 'Пользователь';
  const userId = user.id ?? 0;

  const userpicUrl = username ? `https://t.me/i/userpic/320/${encodeURIComponent(username)}.jpg` : undefined;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      <div className="bg-astrot-card-bg rounded-xl p-4 flex items-center space-x-4 shadow-card border border-[color:rgb(var(--astrot-border)/0.08)]">
        {userpicUrl ? (
          <Image
            src={userpicUrl}
            alt="avatar"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover border border-[color:rgb(var(--astrot-border)/0.12)]"
            priority
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-astrot-surface border border-[color:rgb(var(--astrot-border)/0.12)] flex items-center justify-center text-sm font-semibold">
            {firstName.slice(0, 1)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold">{firstName}</p>
          {username ? <p className="text-xs text-astrot-muted">@{username}</p> : null}
          <p className="text-[10px] text-astrot-muted">ID: {userId || '—'}</p>
        </div>
      </div>
    </motion.div>
  );
}