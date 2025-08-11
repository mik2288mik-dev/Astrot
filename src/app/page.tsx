"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { impactOccurred } from '@/lib/haptics';

export default function Page() {
  const router = useRouter();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold">Ежедневка</h2>
        <p className="text-sm text-hint">Ваши ежедневные подсказки появятся здесь.</p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Ближайшие события</h2>
        <p className="text-sm text-hint">Скоро тут будут важные астрособытия.</p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Календарь‑тизер</h2>
        <p className="text-sm text-hint mb-3">Переход к полному астро‑календарю.</p>
        <Button onClick={() => { impactOccurred('light'); router.push('/calendar'); }}>Открыть календарь</Button>
      </Card>
    </motion.div>
  );
}