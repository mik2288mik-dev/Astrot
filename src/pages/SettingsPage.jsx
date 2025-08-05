import React, { useState } from 'react';
import { Page, Navbar, Link } from 'konsta/react';
import StarField from '../components/StarField';
import KoteusAstrolog from '../components/KoteusAstrolog';
import PremiumFeatures from '../components/PremiumFeatures';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('premium');
  const [userLevel, setUserLevel] = useState(3);
  const [crystals, setCrystals] = useState(150);

  const handlePurchase = (feature, paymentMethod) => {
    // Handle purchase logic here
    console.log('Purchase:', feature, paymentMethod);
    // Add crystals for demo
    if (paymentMethod === 'card') {
      setCrystals(prev => prev + 50);
      setUserLevel(prev => prev + 1);
    }
  };

  const tabs = [
    { id: 'premium', label: '💎 Премиум', icon: '💎' },
    { id: 'profile', label: '👤 Профиль', icon: '👤' },
    { id: 'telegram', label: '📱 Telegram', icon: '📱' },
    { id: 'settings', label: '⚙️ Настройки', icon: '⚙️' }
  ];

  return (
    <Page className="cosmic-bg min-h-screen relative overflow-hidden">
      <StarField />
      
      <Navbar 
        title="🌟 Настройки & Премиум" 
        left={<Link navbar href="/">⬅️ Назад</Link>}
        className="glassy border-b border-white/10"
      />

      <div className="relative z-10 p-4">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'neon-btn'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'premium' && (
          <PremiumFeatures 
            onPurchase={handlePurchase}
            userLevel={userLevel}
            crystals={crystals}
          />
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="glassy-enhanced p-6 rounded-xl text-center">
              <KoteusAstrolog message="🌟 Твой космический профиль готов!" />
              
              <div className="mt-4 space-y-3">
                <div className="text-cyan-100">
                  <span className="text-cyan-300 font-bold">Уровень:</span> {userLevel} 🚀
                </div>
                <div className="text-cyan-100">
                  <span className="text-cyan-300 font-bold">Кристаллы:</span> {crystals} 💎
                </div>
                <div className="text-cyan-100">
                  <span className="text-cyan-300 font-bold">Статус:</span> Космический исследователь ⭐
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-purple-300 mb-3">🏆 Достижения</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-300 text-xs">
                    🥇 Первая карта
                  </div>
                  <div className="bg-purple-500/20 p-2 rounded-lg text-purple-300 text-xs">
                    💎 Сборщик кристаллов
                  </div>
                  <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-300 text-xs">
                    🌟 Звёздный путешественник
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'telegram' && (
          <div className="space-y-4">
            <div className="glassy-enhanced p-6 rounded-xl">
              <h2 className="text-xl font-bold text-blue-300 mb-4 text-center">
                📱 Telegram Integration
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                  <div>
                    <div className="text-blue-300 font-medium">Уведомления</div>
                    <div className="text-blue-200 text-sm">Получай астро-прогнозы</div>
                  </div>
                  <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <div>
                    <div className="text-green-300 font-medium">Бот-помощник</div>
                    <div className="text-green-200 text-sm">Быстрые консультации</div>
                  </div>
                  <button className="neon-btn text-xs py-1 px-3">
                    Подключить
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                  <div>
                    <div className="text-purple-300 font-medium">Премиум через Stars</div>
                    <div className="text-purple-200 text-sm">Оплата Telegram Stars</div>
                  </div>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-1 px-3 rounded-full text-xs">
                    Настроить
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-400/30">
                <h3 className="text-blue-300 font-bold mb-2">🚀 Эксклюзивные функции</h3>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>• Ежедневные персональные прогнозы</li>
                  <li>• Уведомления о важных астро-событиях</li>
                  <li>• Быстрый доступ через бота</li>
                  <li>• Оплата премиума через Telegram</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="glassy-enhanced p-6 rounded-xl">
              <h2 className="text-xl font-bold text-cyan-300 mb-4 text-center">
                ⚙️ Настройки приложения
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Тёмная тема</div>
                    <div className="text-white/70 text-sm">Космический дизайн</div>
                  </div>
                  <div className="w-12 h-6 bg-purple-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Анимации</div>
                    <div className="text-white/70 text-sm">Космические эффекты</div>
                  </div>
                  <div className="w-12 h-6 bg-cyan-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Звуки</div>
                    <div className="text-white/70 text-sm">Космическая музыка</div>
                  </div>
                  <div className="w-12 h-6 bg-gray-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                  </div>
                </div>

                <hr className="border-white/20 my-4" />

                <div className="space-y-3">
                  <button className="w-full p-3 text-left bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                    📊 Экспорт данных
                  </button>
                  <button className="w-full p-3 text-left bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                    🔄 Очистить кэш
                  </button>
                  <button className="w-full p-3 text-left bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                    📧 Поддержка
                  </button>
                  <button className="w-full p-3 text-left bg-red-500/20 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors">
                    🚪 Выйти из аккаунта
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 space-y-3">
          <button className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl shadow-lg animate-pulse">
            💎
          </button>
        </div>
      </div>
    </Page>
  );
}
