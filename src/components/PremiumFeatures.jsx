import React, { useState } from 'react';

const premiumFeatures = [
  {
    id: 'detailed_analysis',
    title: '🔮 Детальный Анализ',
    description: 'Глубокий анализ всех планет, домов и аспектов',
    price: '199₽',
    popular: false
  },
  {
    id: 'compatibility',
    title: '💕 Совместимость',
    description: 'Анализ совместимости с партнером или другом',
    price: '299₽',
    popular: true
  },
  {
    id: 'predictions',
    title: '🌙 Прогнозы',
    description: 'Персональные прогнозы на месяц, год',
    price: '399₽',
    popular: false
  },
  {
    id: 'premium_full',
    title: '⭐ Премиум Полный',
    description: 'Все функции + эксклюзивный контент',
    price: '799₽/мес',
    popular: true,
    savings: 'Экономия 40%'
  }
];

const gameFeatures = [
  {
    title: '🎯 Ежедневные Квесты',
    description: 'Выполняй астрологические задания',
    reward: '+10 космических кристаллов'
  },
  {
    title: '🏆 Рейтинг Предсказателей',
    description: 'Соревнуйся с другими астрологами',
    reward: 'Эксклюзивные титулы'
  },
  {
    title: '💎 Космические Кристаллы',
    description: 'Собирай кристаллы за активность',
    reward: 'Обменивай на премиум функции'
  },
  {
    title: '🌟 Достижения',
    description: 'Разблокируй уникальные достижения',
    reward: 'Особые космические аватары'
  }
];

export default function PremiumFeatures({ onPurchase, userLevel = 0, crystals = 0 }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handlePurchase = (feature) => {
    setSelectedFeature(feature);
    setShowPayment(true);
  };

  const processPayment = (paymentMethod) => {
    // Simulate payment processing
    console.log(`Processing payment for ${selectedFeature.title} via ${paymentMethod}`);
    if (onPurchase) {
      onPurchase(selectedFeature, paymentMethod);
    }
    setShowPayment(false);
    setSelectedFeature(null);
  };

  return (
    <div className="space-y-6">
      {/* User Progress */}
      <div className="glassy-enhanced p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-cyan-300 font-bold">🚀 Твой Прогресс</h3>
          <div className="text-cyan-100 text-sm">
            Уровень {userLevel} • {crystals} 💎
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(userLevel * 10) % 100}%` }}
          ></div>
        </div>
        
        <div className="text-cyan-200 text-xs">
          До следующего уровня: {100 - (userLevel * 10) % 100} XP
        </div>
      </div>

      {/* Premium Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-purple-300 mb-6">
          💎 Премиум Функции
        </h2>
        
        {premiumFeatures.map((feature) => (
          <div 
            key={feature.id}
            className={`glassy p-4 rounded-xl border transition-all duration-300 ${
              feature.popular 
                ? 'border-purple-400/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10' 
                : 'border-white/20'
            }`}
          >
            {feature.popular && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                🔥 Популярное
              </div>
            )}
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-cyan-200 text-sm">{feature.description}</p>
                {feature.savings && (
                  <span className="text-green-400 text-xs font-medium">{feature.savings}</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-cyan-300">{feature.price}</div>
              </div>
            </div>
            
            <button 
              onClick={() => handlePurchase(feature)}
              className="neon-btn w-full text-sm py-2"
            >
              Приобрести
            </button>
          </div>
        ))}
      </div>

      {/* Game Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-cyan-300 mb-6">
          🎮 Игровые Элементы
        </h2>
        
        {gameFeatures.map((game, index) => (
          <div key={index} className="glassy p-4 rounded-xl border border-cyan-400/30">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-cyan-300">{game.title}</h3>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                {game.reward}
              </span>
            </div>
            <p className="text-cyan-100 text-sm">{game.description}</p>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedFeature && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glassy-enhanced p-6 max-w-sm w-full text-center relative">
            <button 
              onClick={() => setShowPayment(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white text-xl"
            >
              ✕
            </button>
            
            <div className="text-4xl mb-4">💳</div>
            <h2 className="text-xl font-bold text-cyan-100 mb-3">
              {selectedFeature.title}
            </h2>
            <p className="text-cyan-200 text-sm mb-4">
              {selectedFeature.description}
            </p>
            <div className="text-2xl font-bold text-purple-300 mb-6">
              {selectedFeature.price}
            </div>
            
            {/* Payment Methods */}
            <div className="space-y-3">
              <button 
                onClick={() => processPayment('card')}
                className="neon-btn w-full"
              >
                💳 Банковская карта
              </button>
              
              <button 
                onClick={() => processPayment('yookassa')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-full w-full font-medium"
              >
                💰 ЮKassa
              </button>
              
              <button 
                onClick={() => processPayment('telegram')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-full w-full font-medium"
              >
                📱 Telegram Stars
              </button>
              
              {crystals >= 100 && (
                <button 
                  onClick={() => processPayment('crystals')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-full w-full font-medium"
                >
                  💎 Космические кристаллы ({Math.min(crystals, 200)})
                </button>
              )}
            </div>
            
            <div className="mt-4 text-xs text-white/60">
              Безопасная оплата • Мгновенная активация
            </div>
          </div>
        </div>
      )}

      {/* Special Offers */}
      <div className="glassy-enhanced p-4 rounded-xl border border-yellow-400/30">
        <h3 className="text-yellow-300 font-bold mb-2 flex items-center">
          ⚡ Ограниченное предложение
          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            -50%
          </span>
        </h3>
        <p className="text-yellow-100 text-sm mb-3">
          Первые 100 пользователей получают все премиум-функции на год всего за 999₽!
        </p>
        <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-2 px-4 rounded-full w-full">
          🔥 Забрать скидку
        </button>
      </div>
    </div>
  );
}