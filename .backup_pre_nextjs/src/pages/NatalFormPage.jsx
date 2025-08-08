/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Page, Navbar, List, ListInput, Button, Link } from 'konsta/react';
import KoteusAstrolog from '../components/KoteusAstrolog';
import StarField from '../components/StarField';

export default function NatalFormPage({ f7router }) {
  const [formData, setFormData] = useState({ name: '', date: '', time: '', city: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const successMessages = [
    'Отлично! Звёзды уже начинают выстраиваться!',
    'Космические данные получены! Готовлю карту...',
    'Запускаю астрологические вычисления!',
    'Вселенная готова раскрыть твои тайны!'
  ];

  useEffect(() => {
    // Clear error when user starts typing
    if (error && (formData.name || formData.date || formData.time || formData.city)) {
      setError('');
    }
  }, [formData, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Как мне к тебе обращаться? Введи своё имя! 🌙');
      return false;
    }
    if (!formData.date) {
      setError('Дата рождения нужна для точных расчётов!');
      return false;
    }
    if (!formData.time) {
      setError('Время рождения влияет на натальную карту!');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Город рождения важен для космических координат!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    // Show success message
    const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
    setCurrentMessage(randomMessage);
    
    // Simulate cosmic calculation delay
    setTimeout(() => {
      f7router.navigate('/natal-result/', { 
        props: { 
          data: formData,
          timestamp: Date.now() // For unique chart generation
        } 
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Page className="cosmic-bg min-h-screen relative overflow-hidden">
      <StarField />
      
      <Navbar 
        title="Натальная Карта" 
        left={<Link navbar href="/">Назад</Link>}
        className="glassy border-b border-white/10"
      />
      
      <div className="p-6 relative z-10">
        {/* Koteus Astrolog */}
        <KoteusAstrolog 
          error={error} 
          message={currentMessage}
          isAnimating={!error && !currentMessage}
        />

        {/* Form Container */}
        <div className="glassy-enhanced p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Input */}
            <div className="neon-input">
              <label className="block text-sm font-medium mb-2 text-cyan-300">
                Твоё космическое имя
              </label>
              <input
                type="text"
                name="name"
                placeholder="Как тебя зовут в этой вселенной?"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Date Input */}
            <div className="neon-input">
              <label className="block text-sm font-medium mb-2 text-cyan-300">
                Дата твоего появления на Земле
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Time Input */}
            <div className="neon-input">
              <label className="block text-sm font-medium mb-2 text-cyan-300">
                Точное время рождения
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* City Input */}
            <div className="neon-input">
              <label className="block text-sm font-medium mb-2 text-cyan-300">
                Город твоего рождения
              </label>
              <input
                type="text"
                name="city"
                placeholder="В каком городе ты появился на свет?"
                value={formData.city}
                onChange={handleChange}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`neon-btn w-full mt-8 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Создаю твою карту звёзд...
                </span>
              ) : (
                'Построить Натальную Карту'
              )}
            </button>
          </form>

          {/* Premium Features Hint */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
            <div className="text-center text-purple-300 text-sm">
              Премиум-функции: детальный анализ, совместимость, прогнозы
              <br />
              <span className="text-xs text-purple-400">Разблокируй полную силу звёзд!</span>
            </div>
          </div>
        </div>

        {/* Cosmic Decorations */}
        <div className="absolute top-20 left-10 w-6 h-6 rounded-full bg-cyan-400 opacity-60 animate-ping"></div>
        <div className="absolute top-40 right-16 w-4 h-4 rounded-full bg-purple-400 opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-8 h-8 rounded-full bg-pink-400 opacity-30 animate-bounce"></div>
      </div>
    </Page>
  );
}
