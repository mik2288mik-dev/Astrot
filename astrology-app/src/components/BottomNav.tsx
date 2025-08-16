import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, Gamepad2, Menu } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'natal-chart', label: 'Натальная карта', icon: Calendar, path: '/natal-chart' },
    { id: 'horoscope', label: 'Гороскоп', icon: Home, path: '/horoscope' },
    { id: 'games', label: 'Игры', icon: Gamepad2, path: '/games' },
    { id: 'more', label: 'Ещё', icon: Menu, path: '/more' },
  ];

  return (
    <div className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;