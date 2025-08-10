import { motion } from 'framer-motion';

export default function HomePreview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <div className="rounded-2xl p-[1px] bg-grad-soft">
        <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-[0_8px_24px_rgba(30,12,64,0.12)] p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-100 to-orb-300/70" />
            <div className="flex-1">
              <div className="typ-title">Мини‑превью</div>
              <div className="typ-caption text-on/70">Здесь появится краткий взгляд на карту и гороскоп дня</div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}