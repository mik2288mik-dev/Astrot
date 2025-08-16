'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { 
  UserIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ChevronDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  houseSystem: string;
  unknownTime: boolean;
}

interface PlaceSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function FormCard({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const { fullName } = useTelegramUser();
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: fullName || '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    houseSystem: 'placidus',
    unknownTime: false
  });

  const houseSystems = [
    { value: 'placidus', label: 'Плацидус' },
    { value: 'koch', label: 'Кох' },
    { value: 'regiomontanus', label: 'Региомонтан' },
    { value: 'campanus', label: 'Кампанус' },
    { value: 'equal', label: 'Равнодомная' },
    { value: 'whole', label: 'Целые знаки' }
  ];

  const handleSubmit = useCallback(() => {
    hapticFeedback('impact', 'medium');
    onSubmit(formData);
  }, [hapticFeedback, onSubmit, formData]);

  useEffect(() => {
    // Показываем главную кнопку Telegram когда форма заполнена
    const isFormValid = formData.name && formData.birthDate && formData.birthPlace && 
                       (formData.birthTime || formData.unknownTime);
    
    if (isFormValid) {
      showMainButton('Рассчитать карту', handleSubmit);
    } else {
      hideMainButton();
    }
    
    return () => hideMainButton();
  }, [formData, showMainButton, hideMainButton, handleSubmit]);

  const searchPlace = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=ru`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching place:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPlace = (place: PlaceSuggestion) => {
    hapticFeedback('selection');
    setFormData({
      ...formData,
      birthPlace: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon)
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    hapticFeedback('selection');
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="page-wrapper animate-fadeIn">
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Натальная карта
        </h1>
        <p className="text-sm text-neutral-500">
          Введите данные для расчета вашей карты рождения
        </p>
      </section>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {/* Имя */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <UserIcon className="w-4 h-4" />
            Имя
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Введите ваше имя"
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        {/* Дата рождения */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <CalendarIcon className="w-4 h-4" />
            Дата рождения
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            required
          />
        </div>

        {/* Время рождения */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <ClockIcon className="w-4 h-4" />
            Время рождения
          </label>
          <div className="flex gap-2">
            <input
              type="time"
              value={formData.birthTime}
              onChange={(e) => handleInputChange('birthTime', e.target.value)}
              disabled={formData.unknownTime}
              className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all disabled:opacity-50"
              required={!formData.unknownTime}
            />
            <label className="flex items-center gap-2 px-4 py-3 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.unknownTime}
                onChange={(e) => handleInputChange('unknownTime', e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm text-neutral-700">Не знаю</span>
            </label>
          </div>
          {formData.unknownTime && (
            <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
              <InformationCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Будет использовано время 12:00
            </p>
          )}
        </div>

        {/* Место рождения */}
        <div className="relative">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <MapPinIcon className="w-4 h-4" />
            Место рождения
          </label>
          <input
            type="text"
            value={formData.birthPlace}
            onChange={(e) => {
              handleInputChange('birthPlace', e.target.value);
              searchPlace(e.target.value);
            }}
            placeholder="Начните вводить город..."
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            required
          />
          
          {/* Подсказки мест */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((place, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectPlace(place)}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                >
                  <p className="text-sm text-neutral-800">{place.display_name}</p>
                </button>
              ))}
            </div>
          )}
          
          {isSearching && (
            <p className="text-xs text-neutral-500 mt-2">Поиск...</p>
          )}
        </div>

        {/* Дополнительные настройки */}
        <div>
          <button
            type="button"
            onClick={() => {
              hapticFeedback('impact', 'light');
              setShowAdvanced(!showAdvanced);
            }}
            className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Дополнительные настройки
          </button>
          
          {showAdvanced && (
            <div className="mt-4 space-y-4 p-4 bg-neutral-50 rounded-xl">
              {/* Координаты */}
              {formData.latitude && formData.longitude && (
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Координаты
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.latitude.toFixed(4)}
                      readOnly
                      className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600"
                    />
                    <input
                      type="text"
                      value={formData.longitude.toFixed(4)}
                      readOnly
                      className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600"
                    />
                  </div>
                </div>
              )}
              
              {/* Система домов */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Система домов
                </label>
                <select
                  value={formData.houseSystem}
                  onChange={(e) => handleInputChange('houseSystem', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                >
                  {houseSystems.map(system => (
                    <option key={system.value} value={system.value}>
                      {system.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка отправки (для веб-версии) */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-200 mb-20"
        >
          Рассчитать карту
        </button>
      </form>
    </div>
  );
}