import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const functions = [
    { id: 'natal-chart', title: 'Натальная карта', icon: '🔮', path: '/natal-chart' },
    { id: 'horoscope', title: 'Гороскоп', icon: '♈', path: '/horoscope' },
    { id: 'ai-astrologer', title: 'AI Астролог', icon: '💬', path: '/more' },
    { id: 'tarot', title: 'Таро', icon: '🎴', path: '/more' },
    { id: 'compatibility', title: 'Совместимость', icon: '💕', path: '/more' },
    { id: 'shop', title: 'Магазин', icon: '🛍️', path: '/more' },
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <div className="welcome-section">
            <h1>Добро пожаловать,</h1>
            <h2>Emily</h2>
          </div>
          <div className="menu-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
        </div>

        <div className="natal-chart-preview glass-card">
          <div className="chart-circle">
            <svg viewBox="0 0 300 300" className="zodiac-wheel">
              <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              <circle cx="150" cy="150" r="60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              
              {/* Zodiac signs positions */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 - 90) * Math.PI / 180;
                const x = 150 + 120 * Math.cos(angle);
                const y = 150 + 120 * Math.sin(angle);
                const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
                return (
                  <text key={i} x={x} y={y} fill="white" fontSize="16" textAnchor="middle" dominantBaseline="middle">
                    {signs[i]}
                  </text>
                );
              })}
              
              {/* Lines dividing houses */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                const x1 = 150 + 60 * Math.cos(angle);
                const y1 = 150 + 60 * Math.sin(angle);
                const x2 = 150 + 140 * Math.cos(angle);
                const y2 = 150 + 140 * Math.sin(angle);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                );
              })}
              
              {/* Planets */}
              <circle cx="180" cy="120" r="4" fill="#FFD700"/>
              <circle cx="120" cy="180" r="4" fill="#C0C0C0"/>
              <circle cx="170" cy="170" r="4" fill="#FF6B6B"/>
            </svg>
          </div>
          <button className="view-details-btn" onClick={() => navigate('/natal-chart')}>
            Подробнее
          </button>
        </div>

        <div className="functions-section">
          <h3>Функции</h3>
          <div className="functions-grid">
            {functions.map((func) => (
              <div
                key={func.id}
                className="function-card glass-card"
                onClick={() => navigate(func.path)}
              >
                <div className="function-icon">{func.icon}</div>
                <span className="function-title">{func.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Home;