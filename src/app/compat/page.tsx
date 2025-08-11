"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold">Совместимость</h2>
        <p className="text-sm text-hint">Добавьте друга, чтобы увидеть совместимость.</p>
      </Card>
    </motion.div>
  );
}