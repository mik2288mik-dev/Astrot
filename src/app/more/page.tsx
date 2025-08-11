"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useTelegram } from '@/providers/telegram-provider';

export default function Page() {
  const { tg, colorScheme, initDataUnsafe, themeParams } = useTelegram();
  type InitData = { user?: { id?: number; username?: string } } | null;
  const init = (initDataUnsafe ?? null) as InitData;
  const user = init?.user;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold">Профиль</h2>
        <p className="text-sm text-hint">Скоро тут будут настройки профиля.</p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Календарь</h2>
        <p className="text-sm text-hint">Перейти в астро‑календарь</p>
        <Link href="/calendar" className="text-link">Открыть</Link>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Telegram Debug</h2>
        <div className="text-sm space-y-1">
          <div><span className="text-hint">isWebApp:</span> {tg ? 'yes' : 'no'}</div>
          <div><span className="text-hint">colorScheme:</span> {colorScheme}</div>
          <div><span className="text-hint">bg_color:</span> {themeParams?.bg_color ?? '-'}</div>
          <div><span className="text-hint">user.id:</span> {user?.id ?? '-'}</div>
          <div><span className="text-hint">username:</span> {user?.username ?? '-'}</div>
        </div>
      </Card>
    </motion.div>
  );
}