import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Bell, label: 'Уведомления', onClick: () => {} },
    { icon: Lock, label: 'Конфиденциальность', onClick: () => {} },
    { icon: HelpCircle, label: 'Помощь', onClick: () => {} },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ChevronLeft size={24} />
        </button>
        <h1>Профиль</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="profile-content">
        <div className="profile-info glass-card">
          <div className="profile-avatar">
            <img src="https://i.pravatar.cc/150?img=5" alt="Profile" />
          </div>
          <h2 className="profile-name">Emily</h2>
          <p className="profile-date">12 июня 1994</p>
        </div>

        <div className="profile-menu">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="menu-item glass-card" onClick={item.onClick}>
                <div className="menu-item-left">
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={20} />
              </div>
            );
          })}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;