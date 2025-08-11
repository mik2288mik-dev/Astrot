"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useTelegram } from '@/providers/telegram-provider';
import { ProfileCard } from '@/components/profile/profile-card';

export default function Page() {
  const { tg, colorScheme, initDataUnsafe, themeParams } = useTelegram();
  type InitData = { user?: { id?: number; username?: string } } | null;
  const init = (initDataUnsafe ?? null) as InitData;
  const user = init?.user;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
      <ProfileCard />
      <Card className="py-5">
        <h2 className="text-lg font-semibold">Календарь</h2>
        <p className="text-sm text-astrot-muted">Перейти в астро‑календарь</p>
        <Link href="/calendar" className="text-link">Открыть</Link>
      </Card>
      <Card className="py-5">
        <h2 className="text-lg font-semibold">Telegram Debug</h2>
        <div className="text-sm space-y-1">
          <div><span className="text-astrot-muted">isWebApp:</span> {tg ? 'yes' : 'no'}</div>
          <div><span className="text-astrot-muted">colorScheme:</span> {colorScheme}</div>
          <div><span className="text-astrot-muted">bg_color:</span> {themeParams?.bg_color ?? '-'}</div>
          <div><span className="text-astrot-muted">user.id:</span> {user?.id ?? '-'}</div>
          <div><span className="text-astrot-muted">username:</span> {user?.username ?? '-'}</div>
        </div>
      </Card>
    </motion.div>
  );
}