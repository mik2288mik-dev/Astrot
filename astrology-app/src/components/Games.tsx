import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, Heart, Coins, Star, Zap, Target } from 'lucide-react';
import BottomNav from './BottomNav';
import './Games.css';

const Games: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    { 
      id: 'fortune-wheel',
      title: 'Колесо Фортуны',
      description: 'Крутите колесо и узнайте свою судьбу',
      icon: Sparkles,
      color: '#FFD700'
    },
    {
      id: 'love-oracle',
      title: 'Оракул Любви',
      description: 'Узнайте ответы на вопросы о любви',
      icon: Heart,
      color: '#FF69B4'
    },
    {
      id: 'tarot-daily',
      title: 'Карта Дня',
      description: 'Выберите карту Таро на сегодня',
      icon: Star,
      color: '#9C27B0'
    },
    {
      id: 'numerology',
      title: 'Нумерология',
      description: 'Раскройте тайны чисел',
      icon: Target,
      color: '#00BCD4'
    },
    {
      id: 'crystal-ball',
      title: 'Хрустальный Шар',
      description: 'Загляните в будущее',
      icon: Zap,
      color: '#FF5722'
    },
    {
      id: 'runes',
      title: 'Руны',
      description: 'Древняя мудрость в символах',
      icon: Coins,
      color: '#4CAF50'
    }
  ];

  return (
    <div className="games-container">
      <div className="games-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ChevronLeft size={24} />
        </button>
        <h1>Игры</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="games-content">
        <div className="games-intro glass-card">
          <h2>Мистические Игры</h2>
          <p>Откройте тайны вселенной через увлекательные игры и предсказания</p>
        </div>

        <div className="games-grid">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div key={game.id} className="game-card glass-card">
                <div className="game-icon" style={{ backgroundColor: game.color + '20' }}>
                  <Icon size={32} color={game.color} />
                </div>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <button className="play-btn">Играть</button>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav activeTab="games" />
    </div>
  );
};

export default Games;