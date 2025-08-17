'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useTelegramUser } from '@/hooks/useTelegram';

interface Location {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
  tzOffset: number;
}

interface ProfileFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  timeUnknown: boolean;
  location: Location | null;
  houseSystem: 'P' | 'W';
}

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData & { tgId: number }) => void;
  initialData?: Partial<ProfileFormData> | undefined;
  isLoading?: boolean;
}

export default function ProfileForm({ onSubmit, initialData, isLoading = false }: ProfileFormProps) {
  const { userId, firstName } = useTelegramUser();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData?.name || firstName || '',
    birthDate: initialData?.birthDate || '',
    birthTime: initialData?.birthTime || '12:00',
    timeUnknown: initialData?.timeUnknown || false,
    location: initialData?.location || null,
    houseSystem: initialData?.houseSystem || 'P'
  });

  useEffect(() => {
    if (formData.location) {
      setLocationQuery(formData.location.name);
    }
  }, [formData.location]);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    setIsLoadingLocation(true);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setLocationSuggestions(data.locations || []);
        setShowLocationDropdown(true);
      }
    } catch (error) {
      console.error('Location search error:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setFormData(prev => ({ ...prev, location }));
    setLocationQuery(location.name);
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (!formData.location) {
      alert('Пожалуйста, выберите место рождения');
      return;
    }

    onSubmit({
      ...formData,
      tgId: userId
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        {/* Заголовок формы */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">
            Рассчитать натальную карту
          </h2>
          <p className="text-center text-white/90 text-sm mt-2">
            Введите данные для построения вашей карты
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all placeholder-neutral-400"
              placeholder="Введите ваше имя"
              required
            />
          </div>

          {/* Дата рождения */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Дата рождения
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
              required
            />
          </div>

          {/* Время рождения */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Время рождения
            </label>
            <div className="space-y-3">
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                disabled={formData.timeUnknown}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
                placeholder="00:00"
              />
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.timeUnknown}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    timeUnknown: e.target.checked,
                    birthTime: e.target.checked ? '12:00' : prev.birthTime
                  }))}
                  className="w-5 h-5 text-purple-600 border-neutral-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="ml-3 text-sm text-neutral-600 group-hover:text-neutral-800 transition-colors">
                  Не знаю точное время
                </span>
              </label>
            </div>
          </div>

          {/* Место рождения */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <MapPinIcon className="inline w-4 h-4 mr-1 -mt-0.5" />
              Место рождения
            </label>
            <div className="relative">
              <input
                ref={locationInputRef}
                type="text"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  handleLocationSearch(e.target.value);
                }}
                onFocus={() => {
                  if (locationSuggestions.length > 0) {
                    setShowLocationDropdown(true);
                  }
                }}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all placeholder-neutral-400 pr-10"
                placeholder="Начните вводить название города..."
                required
              />
              
              {isLoadingLocation && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                </div>
              )}
              
              {showLocationDropdown && locationSuggestions.length > 0 && (
                <div 
                  ref={dropdownRef}
                  className="absolute z-20 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                >
                  {locationSuggestions.map((location, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect(location)}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors border-b border-neutral-100 last:border-b-0"
                    >
                      <div className="font-medium text-neutral-900">{location.name}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {location.timezone} • UTC{location.tzOffset >= 0 ? '+' : ''}{location.tzOffset}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {formData.location && (
              <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-900 font-medium">{formData.location.name}</div>
                <div className="text-xs text-purple-700 mt-0.5">
                  Координаты: {formData.location.lat.toFixed(2)}°, {formData.location.lon.toFixed(2)}°
                </div>
              </div>
            )}
          </div>

          {/* Дополнительные настройки */}
          <div className="border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              <span className="mr-1">+ Дополнительно</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                {formData.location ? (
                  <>
                    {/* Координаты */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Координаты
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="number"
                            step="0.0001"
                            value={formData.location.lat}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              location: prev.location ? { ...prev.location, lat: parseFloat(e.target.value) || 0 } : null
                            }))}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="Широта"
                          />
                          <span className="text-xs text-neutral-500 mt-1 block">Широта</span>
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.0001"
                            value={formData.location.lon}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              location: prev.location ? { ...prev.location, lon: parseFloat(e.target.value) || 0 } : null
                            }))}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="Долгота"
                          />
                          <span className="text-xs text-neutral-500 mt-1 block">Долгота</span>
                        </div>
                      </div>
                    </div>

                    {/* Таймзона */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Часовой пояс
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.location.timezone}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            location: prev.location ? { ...prev.location, timezone: e.target.value } : null
                          }))}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="Europe/Moscow"
                        />
                        <input
                          type="number"
                          step="0.5"
                          value={formData.location.tzOffset}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            location: prev.location ? { ...prev.location, tzOffset: parseFloat(e.target.value) || 0 } : null
                          }))}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="UTC смещение"
                        />
                      </div>
                      <span className="text-xs text-neutral-500 mt-1 block">
                        Название зоны и смещение от UTC
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-2">
                    Сначала выберите место рождения
                  </p>
                )}

                {/* Система домов */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Система домов
                  </label>
                  <select
                    value={formData.houseSystem}
                    onChange={(e) => setFormData(prev => ({ ...prev, houseSystem: e.target.value as 'P' | 'W' }))}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="P">Плацидус (Placidus)</option>
                    <option value="W">Целые знаки (Whole Sign)</option>
                  </select>
                  <span className="text-xs text-neutral-500 mt-1 block">
                    Метод расчета астрологических домов
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Кнопка отправки */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !formData.location}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Обработка...
                </div>
              ) : (
                'Рассчитать карту'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}