"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { BackButton } from '@/components/telegram/back-button';

export default function Page() {
  return (
    <>
      <BackButton visible />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
        <Card>
          <h2 className="text-lg font-semibold">Астрокалендарь</h2>
          <p className="text-sm text-hint">Скоро здесь будет календарь событий.</p>
        </Card>
      </motion.div>
    </>
  );
}