"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  { href: '/natal', title: 'Натальная карта', icon: '/assets/icons/icon_natal_chart.svg' },
  { href: '/horoscope', title: 'Гороскоп дня', icon: '/assets/icons/icon_horoscope.svg' },
  { href: '/compatibility', title: 'Совместимость', icon: '/assets/icons/icon_compatibility.svg' },
  { href: '/journal', title: 'Дневник', icon: '/assets/icons/icon_journal.svg' },
];

export default function HomePage() {
  return (
    <Screen bg="home">
      <RouteTransition routeKey="home">
        <div className="space-y-8">
          <motion.header
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mx-auto relative h-24 w-24 md:h-32 md:w-32 animate-polaroid">
              <Image src="/logo.png" alt="Astrot" fill sizes="(max-width: 768px) 96px, 128px" className="object-contain" priority />
            </div>
            <h1 className="mt-5 typ-h1 text-gradient-soft">Твоя личная астрология</h1>
            <p className="mt-2 typ-body text-on/80 max-w-md mx-auto">
              Премиальный доступ к натальной карте, точным прогнозам и ежедневным инсайтам. Космос — в одном касании.
            </p>
          </motion.header>

          <motion.section
            initial="hidden"
            animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-2 gap-3"
          >
            {features.map((f) => (
              <motion.div key={f.href} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}>
                <Link href={f.href} className="group block">
                  <div className="glass p-4 rounded-2xl shadow-card hover:shadow-glass transition-transform group-hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8">
                        <Image src={f.icon} alt="" fill sizes="32px" className="object-contain" />
                      </div>
                      <div className="typ-body text-on/90 font-semibold">{f.title}</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-lavender/50 via-pink/40 to-blue/40">
              <div className="rounded-2xl bg-white/80 border border-white/60 p-5">
                <h2 className="typ-title">Совет дня</h2>
                <p className="mt-2 typ-body text-on/90">
                  Слушай интуицию и действуй мягко: сегодня звездная погода благоволит вдумчивым шагам и искренним намерениям.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-center"
          >
            <Link href="/natal">
              <Tap className="h-12 px-6 rounded-2xl pastel-gradient text-[#0A0A12] font-semibold shadow-card focus:outline-none focus-visible:shadow-focus">
                Открыть полную карту
              </Tap>
            </Link>
          </motion.section>
        </div>
      </RouteTransition>
    </Screen>
  );
}