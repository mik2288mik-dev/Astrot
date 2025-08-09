import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomeHero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 rounded-2xl text-center"
    >
      <div className="mx-auto animate-polaroid">
        <Image src="/logo.png" alt="Astrot" width={80} height={80} className="mx-auto w-16 h-16 md:w-20 md:h-20 object-contain" priority />
      </div>
      <h1 className="mt-4 typ-h1 text-gradient-soft">Твоя личная астрология</h1>
      <p className="mt-2 typ-body text-on/80 max-w-md mx-auto">
        Премиальный доступ к натальной карте, точным прогнозам и ежедневным инсайтам. Космос — в одном касании.
      </p>
    </motion.header>
  );
}