import React from 'react';

interface IconProps {
  name: 'home' | 'functions' | 'chat' | 'profile' | 'horoscope' | 'compatibility' | 
        'natal_chart' | 'tarot' | 'subscription' | 'store' | 'ai_chat' | 
        'zodiac' | 'star' | 'hearts' | 'crown' | 'love' | 'career' | 'health' |
        'heart' | 'sparkles' | 'moon' | 'sun' | 'light' | 'numbers';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const iconPaths: Record<IconProps['name'], string> = {
  home: '/assets/icons/icon_home.svg',
  functions: '/assets/icons/icon_functions.svg',
  chat: '/assets/icons/icon_ai_chat.svg',
  profile: '/assets/icons/icon_profile.svg',
  horoscope: '/assets/icons/icon_horoscope.svg',
  compatibility: '/assets/icons/icon_compatibility.svg',
  natal_chart: '/assets/icons/icon_natal_chart.svg',
  tarot: '/assets/icons/icon_tarot.svg',
  subscription: '/assets/icons/icon_subscription.svg',
  store: '/assets/icons/icon_store.svg',
  ai_chat: '/assets/icons/icon_ai_chat.svg',
  zodiac: '/assets/deepsoul/zodiac.svg',
  star: '/assets/deepsoul/star.svg',
  hearts: '/assets/deepsoul/hearts.svg',
  crown: '/assets/deepsoul/crown.svg',
  love: '/assets/deepsoul/hearts.svg',
  career: '/assets/deepsoul/star.svg',
  health: '/assets/deepsoul/star.svg',
  heart: '/assets/deepsoul/hearts.svg',
  sparkles: '/assets/deepsoul/star.svg',
  moon: '/assets/deepsoul/star.svg',
  sun: '/assets/deepsoul/star.svg',
  light: '/assets/deepsoul/star.svg',
  numbers: '/assets/deepsoul/functions.svg'
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10'
};

export default function Icon({ name, className = '', size = 'md' }: IconProps) {
  const iconPath = iconPaths[name];
  
  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <img 
      src={iconPath} 
      alt=""
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}