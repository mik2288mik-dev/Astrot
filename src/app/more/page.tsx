"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function Page() {
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
    </motion.div>
  );
}