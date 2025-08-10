import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomeHero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white/70 backdrop-blur-md shadow-[0_4px_16px_rgba(30,12,64,0.06)] p-6 text-center"
    >
      <div className="mx-auto animate-polaroid">
        <Image src="/logo.png" alt="Astrot" width={96} height={96} className="mx-auto w-20 h-auto md:w-24 object-contain" priority />
      </div>
      <h1 className="mt-4 typ-h1">Твоя личная астрология</h1>
      <p className="mt-2 typ-body text-on/80 max-w-md mx-auto">
        Премиальный доступ к натальной карте, точным прогнозам и ежедневным инсайтам. Космос — в одном касании.
      </p>
    </motion.header>
  );
}