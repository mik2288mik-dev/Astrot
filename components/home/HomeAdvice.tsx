import { motion } from 'framer-motion';

export default function HomeAdvice() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-lavender/50 via-pink/40 to-blue/40">
        <div className="rounded-2xl bg-white/80 border border-white/60 p-5">
          <h2 className="typ-title">Совет дня</h2>
          <p className="mt-2 typ-body text-on/90">
            Слушай интуицию и действуй мягко: сегодня звёздная погода благоволит вдумчивым шагам и искренним намерениям.
          </p>
        </div>
      </div>
    </motion.section>
  );
}