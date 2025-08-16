'use client';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/providers/telegram-provider';
import { ProfileCard } from '@/components/profile/profile-card';
import { motion } from 'framer-motion';
import { 
  IconChartDots3, 
  IconZodiacAries, 
  IconCards, 
  IconHeart,
  IconShoppingBag,
  IconMessageCircle,
  IconSparkles,
  IconMoon
} from '@tabler/icons-react';

const features = [
  {
    icon: IconChartDots3,
    title: 'Натальная карта',
    description: 'Персональный астрологический анализ',
    color: 'from-blue-500 to-cyan-500',
    href: '/chart'
  },
  {
    icon: IconZodiacAries,
    title: 'Гороскоп',
    description: 'Ежедневные предсказания',
    color: 'from-purple-500 to-pink-500',
    href: '/horoscope'
  },
  {
    icon: IconMessageCircle,
    title: 'AI Астролог',
    description: 'Персональные консультации',
    color: 'from-green-500 to-emerald-500',
    href: '/ai-astrologer'
  },
  {
    icon: IconCards,
    title: 'Таро',
    description: 'Мистические расклады',
    color: 'from-orange-500 to-red-500',
    href: '/tarot'
  },
  {
    icon: IconHeart,
    title: 'Совместимость',
    description: 'Анализ отношений',
    color: 'from-pink-500 to-rose-500',
    href: '/compatibility'
  },
  {
    icon: IconShoppingBag,
    title: 'Магазин',
    description: 'Амулеты и талисманы',
    color: 'from-indigo-500 to-purple-500',
    href: '/shop'
  }
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useTelegram();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0E0D1B] via-[#1A1A2E] to-[#0E0D1B] text-white">
      {/* Header с приветствием */}
      <div className="px-4 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Добро пожаловать,
              </h1>
              <p className="text-3xl font-bold mt-1">
                {user?.firstName || 'Путешественник'} ✨
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <IconMoon size={40} className="text-purple-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Карточка профиля */}
        <div className="mt-6">
          <ProfileCard />
        </div>

        {/* Астрологическая карта дня */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Ваша карта дня</h3>
            <IconSparkles className="text-yellow-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Луна в</span>
              <span className="font-medium">Скорпионе ♏</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Счастливое число</span>
              <span className="font-medium text-green-400">7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Цвет дня</span>
              <span className="font-medium text-purple-400">Фиолетовый</span>
            </div>
          </div>
          <button 
            onClick={() => router.push('/chart')}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
          >
            Посмотреть полную карту
          </button>
        </motion.div>
      </div>

      {/* Функции приложения */}
      <div className="px-4 pb-20">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold mb-4"
        >
          Функции
        </motion.h2>
        
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                onClick={() => router.push(feature.href)}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.05] hover:shadow-xl">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                  
                  {/* Эффект свечения при наведении */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Нижняя навигация */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0E0D1B] via-[#1A1A2E]/95 to-transparent backdrop-blur-lg border-t border-white/10"
      >
        <div className="flex justify-around items-center py-4">
          <button className="flex flex-col items-center gap-1 text-purple-400">
            <IconSparkles size={24} />
            <span className="text-xs">Главная</span>
          </button>
          <button 
            onClick={() => router.push('/chart')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <IconChartDots3 size={24} />
            <span className="text-xs">Карта</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <IconMessageCircle size={24} />
            <span className="text-xs">Чат</span>
          </button>
          <button 
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <IconHeart size={24} />
            <span className="text-xs">Профиль</span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}