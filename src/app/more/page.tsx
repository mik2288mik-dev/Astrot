"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ProfileCard } from '@/components/profile/profile-card';

export default function Page() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
      <ProfileCard />
      <Card className="py-5">
        <h2 className="text-lg font-semibold">Календарь</h2>
        <p className="text-sm text-astrot-muted">Перейти в астро‑календарь</p>
        <Link href="/calendar" className="text-link">Открыть</Link>
      </Card>
    </motion.div>
  );
}