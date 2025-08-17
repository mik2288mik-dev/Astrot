'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IconArrowLeft, IconSparkles } from '@tabler/icons-react';

const zodiacSigns = [
  { name: 'Овен', symbol: '♈', dates: '21 мар - 19 апр', element: 'Огонь', color: 'from-red-500 to-orange-500' },
  { name: 'Телец', symbol: '♉', dates: '20 апр - 20 мая', element: 'Земля', color: 'from-green-500 to-emerald-500' },
  { name: 'Близнецы', symbol: '♊', dates: '21 мая - 20 июн', element: 'Воздух', color: 'from-yellow-500 to-amber-500' },
  { name: 'Рак', symbol: '♋', dates: '21 июн - 22 июл', element: 'Вода', color: 'from-blue-500 to-cyan-500' },
  { name: 'Лев', symbol: '♌', dates: '23 июл - 22 авг', element: 'Огонь', color: 'from-orange-500 to-red-500' },
  { name: 'Дева', symbol: '♍', dates: '23 авг - 22 сен', element: 'Земля', color: 'from-emerald-500 to-teal-500' },
  { name: 'Весы', symbol: '♎', dates: '23 сен - 22 окт', element: 'Воздух', color: 'from-pink-500 to-purple-500' },
  { name: 'Скорпион', symbol: '♏', dates: '23 окт - 21 ноя', element: 'Вода', color: 'from-purple-500 to-indigo-500' },
  { name: 'Стрелец', symbol: '♐', dates: '22 ноя - 21 дек', element: 'Огонь', color: 'from-indigo-500 to-purple-500' },
  { name: 'Козерог', symbol: '♑', dates: '22 дек - 19 янв', element: 'Земля', color: 'from-gray-600 to-gray-800' },
  { name: 'Водолей', symbol: '♒', dates: '20 янв - 18 фев', element: 'Воздух', color: 'from-cyan-500 to-blue-500' },
  { name: 'Рыбы', symbol: '♓', dates: '19 фев - 20 мар', element: 'Вода', color: 'from-blue-500 to-purple-500' },
];

export default function HoroscopePage() {
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState<typeof zodiacSigns[0] | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0E0D1B] via-[#1A1A2E] to-[#0E0D1B] text-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <IconArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Гороскоп</h1>
          <div className="w-10" />
        </div>

        {!selectedSign ? (
          <>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 mb-6"
            >
              Выберите ваш знак зодиака
            </motion.p>

            {/* Знаки зодиака */}
            <div className="grid grid-cols-3 gap-3">
              {zodiacSigns.map((sign, index) => (
                <motion.button
                  key={sign.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedSign(sign)}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105">
                    <div className={`text-3xl mb-2 bg-gradient-to-br ${sign.color} bg-clip-text text-transparent`}>
                      {sign.symbol}
                    </div>
                    <p className="text-sm font-medium">{sign.name}</p>
                    <p className="text-xs text-gray-500">{sign.dates}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Выбранный знак */}
            <div className={`bg-gradient-to-br ${selectedSign.color} p-1 rounded-2xl`}>
              <div className="bg-[#0E0D1B]/90 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-5xl mb-2">{selectedSign.symbol}</div>
                    <h2 className="text-2xl font-bold">{selectedSign.name}</h2>
                    <p className="text-gray-400">{selectedSign.dates}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSign(null)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Изменить
                  </button>
                </div>
              </div>
            </div>

            {/* Прогноз на сегодня */}
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Сегодня</h3>
                <IconSparkles className="text-yellow-400" />
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Сегодня благоприятный день для новых начинаний. Звезды советуют проявить инициативу в делах, 
                которые вы долго откладывали. Ваша энергия на высоте, используйте это время максимально продуктивно.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Любовь</p>
                  <div className="flex justify-center gap-1">
                    {[1,2,3,4].map(i => (
                      <img key={i} src="/assets/deepsoul/hearts.svg" alt="" className="w-4 h-4" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Карьера</p>
                  <div className="flex justify-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <img key={i} src="/assets/deepsoul/star.svg" alt="" className="w-4 h-4" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Здоровье</p>
                  <div className="flex justify-center gap-1">
                    {[1,2,3].map(i => (
                      <img key={i} src="/assets/deepsoul/star.svg" alt="" className="w-4 h-4" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Прогноз на завтра */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-semibold mb-3">Завтра</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Завтрашний день потребует от вас терпения и внимательности. Возможны небольшие препятствия, 
                но они лишь закалят ваш характер.
              </p>
            </div>

            {/* Совет дня */}
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl p-4 backdrop-blur-sm border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <img src="/assets/deepsoul/star.svg" alt="" className="w-5 h-5 mt-0.5" />
                <p className="text-sm">
                  <span className="font-semibold">Совет дня:</span> Доверьтесь интуиции и не бойтесь рисковать
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}