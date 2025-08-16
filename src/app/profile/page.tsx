'use client';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/providers/telegram-provider';
import { motion } from 'framer-motion';
import { 
  IconArrowLeft, 
  IconCalendar,
  IconSettings,
  IconBell,
  IconShield,
  IconHelpCircle,
  IconLogout,
  IconCrown
} from '@tabler/icons-react';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { user, platform, colorScheme } = useTelegram();

  const menuItems = [
    { icon: IconCalendar, label: 'Дата рождения', value: '12 июня 1994', color: 'from-blue-500 to-cyan-500' },
    { icon: IconBell, label: 'Уведомления', value: 'Включены', color: 'from-green-500 to-emerald-500' },
    { icon: IconShield, label: 'Конфиденциальность', value: 'Защищено', color: 'from-purple-500 to-pink-500' },
    { icon: IconSettings, label: 'Настройки', value: '', color: 'from-orange-500 to-red-500' },
    { icon: IconHelpCircle, label: 'Помощь', value: '', color: 'from-indigo-500 to-purple-500' },
  ];

  const photoUrl = user?.photoUrl || (user?.username ? 
    `https://t.me/i/userpic/320/${user.username}.jpg` : undefined);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0E0D1B] via-[#1A1A2E] to-[#0E0D1B] text-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <IconArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Профиль</h1>
          <div className="w-10" />
        </div>

        {/* Профиль пользователя */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl p-6 backdrop-blur-sm border border-white/10 mb-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="avatar"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-500/30 shadow-xl"
                priority
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold shadow-xl ring-4 ring-purple-500/30">
                {user?.firstName?.slice(0, 1).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {user?.firstName || 'Пользователь'}
                {user?.isPremium && (
                  <IconCrown size={20} className="text-yellow-400" />
                )}
              </h2>
              {user?.username && (
                <p className="text-gray-400">@{user.username}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">ID: {user?.id || '—'}</p>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">12</p>
              <p className="text-xs text-gray-400">Карт</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">48</p>
              <p className="text-xs text-gray-400">Прогнозов</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">365</p>
              <p className="text-xs text-gray-400">Дней с нами</p>
            </div>
          </div>
        </motion.div>

        {/* Информация о системе */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-4 backdrop-blur-sm border border-white/5 mb-6"
        >
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Информация</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Платформа</span>
              <span className="text-gray-300">{platform || 'Unknown'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Тема</span>
              <span className="text-gray-300">{colorScheme === 'dark' ? 'Темная' : 'Светлая'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Язык</span>
              <span className="text-gray-300">{user?.languageCode?.toUpperCase() || 'RU'}</span>
            </div>
          </div>
        </motion.div>

        {/* Меню */}
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="w-full group"
                onClick={() => {
                  if (item.label === 'Настройки') router.push('/settings');
                  if (item.label === 'Помощь') router.push('/help');
                }}
              >
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.value && (
                      <span className="text-sm text-gray-400">{item.value}</span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Кнопка выхода */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full mt-6 bg-gradient-to-r from-red-600/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
          onClick={() => {
            // Логика выхода
            console.log('Logout');
          }}
        >
          <div className="flex items-center justify-center space-x-2">
            <IconLogout size={20} className="text-red-400" />
            <span className="font-medium text-red-400">Выйти</span>
          </div>
        </motion.button>
      </div>
    </main>
  );
}