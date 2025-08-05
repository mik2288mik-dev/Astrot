import React, { useState, useEffect, useCallback } from 'react';

const welcomeMessages = [
  'Привет! Я Котеус-Астролог, твой космический проводник!',
  'Готов раскрыть тайны звёзд для тебя!',
  'Позволь мне заглянуть в твою космическую судьбу!',
  'Вселенная шепчет... я переведу её слова!',
  'Звёзды уже выстроились для твоей натальной карты!'
];

const errorMessages = [
  'Упс! Что-то пошло не так в космосе...',
  'Звёзды немного запутались, попробуй ещё раз!',
  'Космическая ошибка! Проверь данные, мой друг!',
  'Луна скрыла информацию... заполни все поля!',
  'Метеориты помешали... исправь ошибки!'
];

export default function KoteusAstrolog({ message, error, isAnimating = false }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [avatarClass, setAvatarClass] = useState('');

  const getRandomMessage = useCallback((messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  useEffect(() => {
    if (error) {
      setCurrentMessage(getRandomMessage(errorMessages));
      setAvatarClass('animate-shake');
    } else if (message) {
      setCurrentMessage(message);
      setAvatarClass('animate-pulse');
    } else {
      setCurrentMessage(getRandomMessage(welcomeMessages));
      setAvatarClass('animate-bounce');
    }
  }, [error, message, getRandomMessage]);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setCurrentMessage(getRandomMessage(welcomeMessages));
      }, 4000); // Увеличил интервал для меньшего повторения
      return () => clearInterval(interval);
    }
  }, [isAnimating, getRandomMessage]);

  const isError = Boolean(error);
  const messageStyle = isError 
    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/30' 
    : 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-cyan-400/30';
  const textStyle = isError ? 'text-red-300' : 'text-cyan-100';
  const energyColor = isError ? 'bg-red-400' : 'bg-cyan-400';

  return (
    <div className="flex flex-col items-center space-y-4 mb-6 p-6 glassy-enhanced">
      {/* Cosmic Cat Avatar */}
      <div className={`relative ${avatarClass}`}>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 p-1">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-800 to-blue-900 flex items-center justify-center text-4xl relative overflow-hidden">
            *
            {/* Cosmic sparkles */}
            <div className="absolute inset-0 cosmic-sparkles"></div>
          </div>
        </div>
        {/* Floating cosmic particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cyan-400 animate-ping"></div>
        <div className="absolute -bottom-1 -left-2 w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
      </div>

      {/* Message Bubble */}
      <div className={`relative max-w-sm text-center p-4 rounded-2xl ${messageStyle} border backdrop-blur-md`}>
        <div className={`text-lg font-medium ${textStyle} drop-shadow-lg`}>
          {currentMessage}
        </div>
        
        {/* Speech bubble tail */}
        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${messageStyle} border-r border-b`}></div>
      </div>

      {/* Cosmic energy indicator */}
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${energyColor} animate-pulse`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}