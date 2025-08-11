"use client";

import { Screen } from '@/components/Screen';
import { RouteTransition } from '@/components/RouteTransition';
import { Tap } from '@/components/Tap';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HomeHero from '@/components/home/HomeHero';
import HomeActions from '@/components/home/HomeActions';
import HomeAdvice from '@/components/home/HomeAdvice';
import HomePreview from '@/components/home/HomePreview';

// Features moved into HomeActions component

export default function HomePage() {
  return (
    <Screen bg="home">
      <RouteTransition routeKey="home">
        <div className="space-y-8">
          <HomeHero />
          <HomeActions />
          <HomePreview />
          <HomeAdvice />

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-center"
          >
            <Link href="/natal">
              <Tap className="h-12 px-6 rounded-xl text-white bg-grad-accent shadow-[0_8px_24px_rgba(161,107,254,0.35)] focus:outline-none focus-visible:shadow-focus">
                Открыть полную карту
              </Tap>
            </Link>
          </motion.section>
        </div>
      </RouteTransition>
    </Screen>
  );
}