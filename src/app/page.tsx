"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { impactOccurred } from '@/lib/haptics';

export default function Page() {
  const router = useRouter();
  return (
    <div className="h-full min-h-screen bg-[--astrot-bg] text-[--astrot-text]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-4"
      >
        <Card className="py-5 transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <h2 className="text-lg font-semibold">Ежедневка</h2>
          <p className="text-sm text-astrot-muted">Ваши ежедневные подсказки появятся здесь.</p>
        </Card>
        <Card className="py-5 transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <h2 className="text-lg font-semibold">Ближайшие события</h2>
          <p className="text-sm text-astrot-muted">Скоро тут будут важные астрособытия.</p>
        </Card>
        <Card className="py-5 transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <h2 className="text-lg font-semibold">Календарь‑тизер</h2>
          <p className="text-sm text-astrot-muted mb-3">Переход к полному астро‑календарю.</p>
          <Button
            className="bg-[rgb(var(--astrot-accent))] text-white rounded-full px-4 py-2 text-sm font-medium shadow-md hover:bg-opacity-90 transition"
            onClick={() => {
              impactOccurred('light');
              router.push('/calendar');
            }}
          >
            Открыть календарь
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}