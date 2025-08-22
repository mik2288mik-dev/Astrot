'use client';

import React, { useEffect, useState } from 'react';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { getActiveChart } from '../../lib/birth/storage';
import type { SavedChart } from '../../lib/birth/storage';
import CartoonNatalWheel from '@/components/natal/CartoonNatalWheel';
import type { ChartData } from '@/components/natal/NatalWheel';

export default function HomePage() {
  const { firstName, userId } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const [activeChart, setActiveChart] = useState<SavedChart | null>(null);
  const [chart, setChart] = useState<ChartData | 'loading' | 'error' | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dailyTip, setDailyTip] = useState<string>('');

  // Загружаем профиль для получения предпочитаемого имени
  useEffect(() => {
    if (userId) {
      loadProfile();
    }
    loadDailyTip();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const res = await fetch(`/api/profile?tgId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadDailyTip = async () => {
    try {
      const res = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tgId: userId?.toString() })
      });
      if (res.ok) {
        const data = await res.json();
        // Берём первый элемент из tldr или используем дефолт
        if (data.tldr && Array.isArray(data.tldr)) {
          setDailyTip(data.tldr[0] || 'Сегодня отличный день для новых начинаний!');
        } else {
          setDailyTip('Доверьтесь своей интуиции сегодня');
        }
      }
    } catch (error) {
      setDailyTip('Звёзды благоволят вам сегодня');
    }
  };

  const birth = activeChart?.input;
  
  // Определяем имя для отображения
  const tg = (typeof window !== 'undefined') ? (window as any).Telegram?.WebApp?.initDataUnsafe?.user : null;
  const displayName = profile?.preferredName || 
    [tg?.first_name, tg?.last_name].filter(Boolean).join(' ') || 
    firstName || 
    'друг';

  useEffect(() => {
    // Загружаем активную карту
    const savedChart = getActiveChart();
    setActiveChart(savedChart);
  }, []);

  useEffect(() => {
    if (birth) {
      setChart('loading');
      loadChart();
    }
  }, [birth]);

  const loadChart = async () => {
    if (!birth) {
      setChart(null);
      return;
    }

    try {
      const response = await fetch('/api/chart/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birth })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate chart');
      }

      const data = await response.json();
      setChart(data);
    } catch (error) {
      console.error('Error loading chart:', error);
      setChart('error');
    }
  };

  const handleNavigate = (path: string) => {
    if (hapticFeedback) {
      hapticFeedback('impact', 'light');
    }
    window.location.href = path;
  };

  return (
    <div className="cartoon-page">
      <div className="cartoon-container">
        {/* Приветствие */}
        <div className="welcome-section">
          <h1 className="welcome-title">
            <span className="wave-emoji">👋</span>
            Привет, {displayName}!
          </h1>
          <p className="welcome-subtitle">
            Добро пожаловать в мир магии звёзд ✨
          </p>
        </div>

        {/* Натальная карта */}
        <div className="cartoon-card main-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="star-icon">⭐</span>
              Натальная карта
            </h2>
            {birth && (
              <span className="card-date">
                {new Date(birth.date).toLocaleDateString('ru-RU')}
              </span>
            )}
          </div>
          
          <div className="chart-container">
            {chart === 'loading' ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Загружаем магию...</p>
              </div>
            ) : chart === 'error' ? (
              <div className="error-state">
                <span className="error-icon">😔</span>
                <p>Упс! Что-то пошло не так</p>
                <button onClick={loadChart} className="retry-button">
                  Попробовать снова
                </button>
              </div>
            ) : chart ? (
              <div className="chart-wrapper">
                <CartoonNatalWheel 
                  data={chart} 
                  size={240}
                  onPlanetClick={(planet) => {
                    console.log('Выбрана планета:', planet);
                  }}
                />
                <div className="chart-glow"></div>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🌙</span>
                <p>Карта ещё не построена</p>
                <p className="empty-hint">Давайте откроем тайны звёзд!</p>
              </div>
            )}
          </div>

          <div className="card-actions">
            <button
              onClick={() => handleNavigate(birth ? '/chart' : '/natal')}
              className="cartoon-btn btn-primary"
            >
              <span>{birth ? 'Открыть карту' : 'Построить карту'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </button>
            <button
              onClick={() => handleNavigate('/horoscope')}
              className="cartoon-btn btn-secondary"
            >
              <span className="sparkle-icon">✨</span>
              <span>Гороскоп</span>
            </button>
          </div>
        </div>

        {/* Совет дня */}
        {dailyTip && (
          <div className="tip-card">
            <div className="tip-icon">💫</div>
            <div className="tip-content">
              <h3>Совет дня</h3>
              <p>{dailyTip}</p>
            </div>
            <div className="tip-decoration"></div>
          </div>
        )}

        {/* Быстрые действия */}
        <div className="quick-actions">
          <h2 className="section-title">Быстрые действия</h2>
          <div className="action-grid">
            <button
              onClick={() => handleNavigate('/profile')}
              className="action-card"
            >
              <div className="action-icon profile-icon">👤</div>
              <div className="action-title">Профиль</div>
              <div className="action-subtitle">Ваши данные</div>
            </button>
            
            <button
              onClick={() => handleNavigate('/functions')}
              className="action-card"
            >
              <div className="action-icon functions-icon">🎯</div>
              <div className="action-title">Функции</div>
              <div className="action-subtitle">Все возможности</div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cartoon-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #FFFBF7 0%, #FFE5ED 50%, #FFE0EC 100%);
          padding-bottom: 110px;
        }

        .cartoon-container {
          max-width: 428px;
          margin: 0 auto;
          padding: 20px 16px;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 32px;
          animation: slideDown 0.6s ease-out;
        }

        .welcome-title {
          font-size: 32px;
          font-weight: 800;
          color: #4A3D5C;
          font-family: 'Fredoka', 'Baloo 2', sans-serif;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .wave-emoji {
          animation: wave 2s ease-in-out infinite;
          display: inline-block;
        }

        .welcome-subtitle {
          font-size: 18px;
          color: #9B8FAB;
          font-family: 'Comic Neue', sans-serif;
        }

        .cartoon-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 245, 237, 0.98) 100%);
          border-radius: 32px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(183, 148, 246, 0.15);
          border: 2px solid rgba(183, 148, 246, 0.1);
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          animation: fadeInScale 0.5s ease-out;
        }

        .cartoon-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(183, 148, 246, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-title {
          font-size: 22px;
          font-weight: 700;
          color: #4A3D5C;
          font-family: 'Fredoka', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .star-icon {
          font-size: 24px;
          animation: twinkle 3s ease-in-out infinite;
        }

        .card-date {
          font-size: 14px;
          color: #9B8FAB;
          font-family: 'Comic Neue', sans-serif;
          background: linear-gradient(135deg, #FFE0EC 0%, #E8D5FF 100%);
          padding: 6px 12px;
          border-radius: 20px;
        }

        .chart-container {
          height: 280px;
          background: linear-gradient(135deg, #E8D5FF 0%, #D6ECFF 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .chart-wrapper {
          position: relative;
          padding: 20px;
        }

        .chart-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(183, 148, 246, 0.2) 0%, transparent 70%);
          animation: glowPulse 3s ease-in-out infinite;
          pointer-events: none;
        }

        .loading-spinner {
          text-align: center;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(183, 148, 246, 0.2);
          border-top-color: #B794F6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .empty-state,
        .error-state {
          text-align: center;
        }

        .empty-icon,
        .error-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 16px;
          animation: float 3s ease-in-out infinite;
        }

        .empty-hint {
          font-size: 14px;
          color: #B794F6;
          margin-top: 8px;
        }

        .retry-button {
          margin-top: 16px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #B794F6 0%, #9F7AEA 100%);
          color: white;
          border: none;
          border-radius: 20px;
          font-family: 'Comic Neue', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .retry-button:hover {
          transform: scale(1.05);
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }

        .cartoon-btn {
          flex: 1;
          padding: 16px 24px;
          border-radius: 24px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Comic Neue', 'Baloo 2', sans-serif;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #B794F6 0%, #9F7AEA 100%);
          color: white;
          box-shadow: 0 8px 24px rgba(183, 148, 246, 0.35);
        }

        .btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 32px rgba(183, 148, 246, 0.45);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #FFE0EC 0%, #E8D5FF 100%);
          color: #6B5D7A;
          box-shadow: 0 4px 16px rgba(183, 148, 246, 0.15);
        }

        .btn-secondary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 20px rgba(183, 148, 246, 0.25);
        }

        .sparkle-icon {
          font-size: 18px;
        }

        .tip-card {
          background: linear-gradient(135deg, #FFF9D6 0%, #FFE5D6 100%);
          border-radius: 28px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          border: 2px solid rgba(255, 200, 100, 0.2);
          box-shadow: 0 4px 20px rgba(255, 200, 100, 0.15);
          position: relative;
          overflow: hidden;
          animation: slideUp 0.6s ease-out 0.2s both;
        }

        .tip-icon {
          font-size: 32px;
          animation: bounce 2s ease-in-out infinite;
        }

        .tip-content h3 {
          font-size: 16px;
          font-weight: 700;
          color: #6B5D7A;
          margin-bottom: 4px;
          font-family: 'Fredoka', sans-serif;
        }

        .tip-content p {
          font-size: 15px;
          color: #9B8FAB;
          margin: 0;
          font-family: 'Comic Neue', sans-serif;
        }

        .tip-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(255, 200, 100, 0.2) 0%, transparent 70%);
          border-radius: 50%;
        }

        .quick-actions {
          margin-top: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #4A3D5C;
          margin-bottom: 16px;
          font-family: 'Fredoka', sans-serif;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .action-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 245, 237, 0.95) 100%);
          border-radius: 24px;
          padding: 20px;
          border: 2px solid rgba(183, 148, 246, 0.1);
          box-shadow: 0 4px 16px rgba(183, 148, 246, 0.1);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          text-align: center;
          animation: fadeInScale 0.5s ease-out 0.3s both;
        }

        .action-card:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 24px rgba(183, 148, 246, 0.2);
          border-color: rgba(183, 148, 246, 0.2);
        }

        .action-icon {
          font-size: 36px;
          margin-bottom: 12px;
          display: block;
        }

        .profile-icon {
          animation: wobble 3s ease-in-out infinite;
        }

        .functions-icon {
          animation: rotate 4s linear infinite;
        }

        .action-title {
          font-size: 16px;
          font-weight: 700;
          color: #4A3D5C;
          margin-bottom: 4px;
          font-family: 'Fredoka', sans-serif;
        }

        .action-subtitle {
          font-size: 13px;
          color: #9B8FAB;
          font-family: 'Comic Neue', sans-serif;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.9); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}