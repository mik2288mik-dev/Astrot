import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle, ShoppingBag, Heart, BookOpen, Settings, Star, Users, Gift } from 'lucide-react';
import BottomNav from './BottomNav';
import './More.css';

const More: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'ai-astrologer',
      title: 'AI Астролог',
      description: 'Персональные консультации',
      icon: MessageCircle,
      color: '#667eea'
    },
    {
      id: 'shop',
      title: 'Магазин',
      description: 'Амулеты и талисманы',
      icon: ShoppingBag,
      color: '#FF6B6B'
    },
    {
      id: 'compatibility',
      title: 'Совместимость',
      description: 'Проверьте вашу пару',
      icon: Heart,
      color: '#FF69B4'
    },
    {
      id: 'learning',
      title: 'Обучение',
      description: 'Курсы астрологии',
      icon: BookOpen,
      color: '#4CAF50'
    },
    {
      id: 'community',
      title: 'Сообщество',
      description: 'Общайтесь с единомышленниками',
      icon: Users,
      color: '#00BCD4'
    },
    {
      id: 'premium',
      title: 'Premium',
      description: 'Расширенные функции',
      icon: Star,
      color: '#FFD700'
    },
    {
      id: 'gifts',
      title: 'Подарки',
      description: 'Ежедневные бонусы',
      icon: Gift,
      color: '#9C27B0'
    },
    {
      id: 'settings',
      title: 'Настройки',
      description: 'Управление приложением',
      icon: Settings,
      color: '#757575'
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    if (featureId === 'settings') {
      navigate('/profile');
    }
    // Handle other features
  };

  return (
    <div className="more-container">
      <div className="more-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ChevronLeft size={24} />
        </button>
        <h1>Ещё</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="more-content">
        <div className="more-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.id} 
                className="more-item glass-card"
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="more-icon" style={{ backgroundColor: feature.color + '20' }}>
                  <Icon size={24} color={feature.color} />
                </div>
                <div className="more-info">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="app-info glass-card">
          <h3>О приложении</h3>
          <p>Deepsoul v1.0.0</p>
          <p className="copyright">© 2024 Deepsoul. Все права защищены.</p>
        </div>
      </div>
      <BottomNav activeTab="more" />
    </div>
  );
};

export default More;