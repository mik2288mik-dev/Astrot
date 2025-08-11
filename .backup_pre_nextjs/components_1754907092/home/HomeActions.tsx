import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  { href: '/natal', title: 'Натальная карта', icon: '/assets/icons/icon_natal_chart.svg' },
  { href: '/horoscope', title: 'Гороскоп дня', icon: '/assets/icons/icon_horoscope.svg' },
  { href: '/compatibility', title: 'Совместимость', icon: '/assets/icons/icon_compatibility.svg' },
  { href: '/journal', title: 'Дневник', icon: '/assets/icons/icon_journal.svg' },
];

export default function HomeActions() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
      className="grid grid-cols-2 gap-3"
    >
      {features.map((f) => (
        <motion.div key={f.href} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}>
          <Link href={f.href} className="group block">
            <div className="p-4 rounded-2xl bg-white/70 hover:bg-white/80 backdrop-blur-md shadow-[0_8px_24px_rgba(30,12,64,0.12)] transition-transform group-hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <div className="relative h-6 w-6 md:h-7 md:w-7">
                  <Image src={f.icon} alt="" fill sizes="28px" className="object-contain" />
                </div>
                <div className="typ-body text-on/90 font-semibold">{f.title}</div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.section>
  );
}