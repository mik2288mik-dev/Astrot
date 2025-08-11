"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MainButton } from '@/components/telegram/main-button';
import { useMemo, useState } from 'react';

export default function Page() {
  const [hasData] = useState(false);
  const text = useMemo(() => (hasData ? 'Обновить данные' : 'Ввести данные рождения'), [hasData]);
  return (
    <>
      <MainButton text={text} visible />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
        <Card>
          <h2 className="text-lg font-semibold">Онбординг данных рождения</h2>
          <p className="text-sm text-astrot-muted">Заполните дату, время и место рождения.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Ваша карта</h2>
          <p className="text-sm text-astrot-muted">Скоро тут появится ваша натальная карта.</p>
        </Card>
      </motion.div>
    </>
  );
}