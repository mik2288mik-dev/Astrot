import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BottomNav from './BottomNav';
import './NatalChart.css';

const NatalChart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="natal-chart-container">
      <div className="natal-chart-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ChevronLeft size={24} />
        </button>
        <h1>Натальная карта</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="natal-chart-content">
        <div className="chart-main glass-card">
          <svg viewBox="0 0 400 400" className="natal-wheel">
            <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            
            {/* Zodiac signs */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * Math.PI / 180;
              const x = 200 + 165 * Math.cos(angle);
              const y = 200 + 165 * Math.sin(angle);
              const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
              return (
                <text key={i} x={x} y={y} fill="white" fontSize="20" textAnchor="middle" dominantBaseline="middle">
                  {signs[i]}
                </text>
              );
            })}
            
            {/* House lines */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const x1 = 200 + 90 * Math.cos(angle);
              const y1 = 200 + 90 * Math.sin(angle);
              const x2 = 200 + 190 * Math.cos(angle);
              const y2 = 200 + 190 * Math.sin(angle);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              );
            })}
            
            {/* Planets */}
            <circle cx="240" cy="160" r="5" fill="#FFD700">
              <title>Солнце в Близнецах</title>
            </circle>
            <circle cx="160" cy="240" r="5" fill="#C0C0C0">
              <title>Луна в Деве</title>
            </circle>
            <circle cx="220" cy="220" r="5" fill="#FF6B6B">
              <title>Марс во Льве</title>
            </circle>
            <circle cx="180" cy="180" r="5" fill="#4FC3F7">
              <title>Меркурий в Близнецах</title>
            </circle>
            <circle cx="250" cy="200" r="5" fill="#FF9800">
              <title>Юпитер в Весах</title>
            </circle>
          </svg>
        </div>

        <div className="chart-info">
          <h2>Ваши планеты</h2>
          <div className="planets-list">
            <div className="planet-item glass-card">
              <span className="planet-symbol">☉</span>
              <div className="planet-details">
                <span className="planet-name">Солнце</span>
                <span className="planet-sign">Близнецы 22°</span>
              </div>
            </div>
            <div className="planet-item glass-card">
              <span className="planet-symbol">☽</span>
              <div className="planet-details">
                <span className="planet-name">Луна</span>
                <span className="planet-sign">Дева 15°</span>
              </div>
            </div>
            <div className="planet-item glass-card">
              <span className="planet-symbol">♂</span>
              <div className="planet-details">
                <span className="planet-name">Марс</span>
                <span className="planet-sign">Лев 8°</span>
              </div>
            </div>
            <div className="planet-item glass-card">
              <span className="planet-symbol">☿</span>
              <div className="planet-details">
                <span className="planet-name">Меркурий</span>
                <span className="planet-sign">Близнецы 18°</span>
              </div>
            </div>
            <div className="planet-item glass-card">
              <span className="planet-symbol">♃</span>
              <div className="planet-details">
                <span className="planet-name">Юпитер</span>
                <span className="planet-sign">Весы 12°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav activeTab="natal-chart" />
    </div>
  );
};

export default NatalChart;