import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BottomNav from './BottomNav';
import './Horoscope.css';

const Horoscope: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSign, setSelectedSign] = useState('gemini');
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const zodiacSigns = [
    { id: 'aries', name: 'Овен', symbol: '♈', dates: '21.03 - 19.04' },
    { id: 'taurus', name: 'Телец', symbol: '♉', dates: '20.04 - 20.05' },
    { id: 'gemini', name: 'Близнецы', symbol: '♊', dates: '21.05 - 20.06' },
    { id: 'cancer', name: 'Рак', symbol: '♋', dates: '21.06 - 22.07' },
    { id: 'leo', name: 'Лев', symbol: '♌', dates: '23.07 - 22.08' },
    { id: 'virgo', name: 'Дева', symbol: '♍', dates: '23.08 - 22.09' },
    { id: 'libra', name: 'Весы', symbol: '♎', dates: '23.09 - 22.10' },
    { id: 'scorpio', name: 'Скорпион', symbol: '♏', dates: '23.10 - 21.11' },
    { id: 'sagittarius', name: 'Стрелец', symbol: '♐', dates: '22.11 - 21.12' },
    { id: 'capricorn', name: 'Козерог', symbol: '♑', dates: '22.12 - 19.01' },
    { id: 'aquarius', name: 'Водолей', symbol: '♒', dates: '20.01 - 18.02' },
    { id: 'pisces', name: 'Рыбы', symbol: '♓', dates: '19.02 - 20.03' },
  ];

  const periods = [
    { id: 'today', label: 'Сегодня' },
    { id: 'tomorrow', label: 'Завтра' },
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
  ];

  const horoscopeText = {
    today: 'Сегодня звезды благоприятствуют новым начинаниям. Ваша энергия и энтузиазм помогут преодолеть любые препятствия. Удачное время для важных решений и встреч.',
    tomorrow: 'Завтра ожидается день полный сюрпризов. Будьте готовы к неожиданным поворотам событий. Доверьтесь интуиции.',
    week: 'На этой неделе вас ждут интересные знакомства и возможности для роста. Не упустите шанс проявить себя.',
    month: 'Этот месяц принесет стабильность и гармонию. Время для планирования будущего и укрепления отношений.',
  };

  return (
    <div className="horoscope-container">
      <div className="horoscope-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ChevronLeft size={24} />
        </button>
        <h1>Гороскоп</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="horoscope-content">
        <div className="period-selector">
          {periods.map((period) => (
            <button
              key={period.id}
              className={`period-btn ${selectedPeriod === period.id ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period.id)}
            >
              {period.label}
            </button>
          ))}
        </div>

        <div className="zodiac-grid">
          {zodiacSigns.map((sign) => (
            <div
              key={sign.id}
              className={`zodiac-item glass-card ${selectedSign === sign.id ? 'active' : ''}`}
              onClick={() => setSelectedSign(sign.id)}
            >
              <span className="zodiac-symbol">{sign.symbol}</span>
              <span className="zodiac-name">{sign.name}</span>
            </div>
          ))}
        </div>

        <div className="horoscope-text glass-card">
          <h2>{zodiacSigns.find(s => s.id === selectedSign)?.name}</h2>
          <p className="zodiac-dates">{zodiacSigns.find(s => s.id === selectedSign)?.dates}</p>
          <p className="horoscope-description">
            {horoscopeText[selectedPeriod as keyof typeof horoscopeText]}
          </p>
          
          <div className="horoscope-stats">
            <div className="stat-item">
              <span className="stat-label">Любовь</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-label">Карьера</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-label">Здоровье</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav activeTab="horoscope" />
    </div>
  );
};

export default Horoscope;