'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, PlusIcon, MapPinIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
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

  const handleLocationSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    setIsLoadingLocation(true);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setLocationSuggestions(data.locations || []);
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
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-6 text-neutral-900">
        Натальная карта
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Имя */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Имя
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            placeholder="Ваше имя"
            required
          />
        </div>

        {/* Дата рождения */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            <CalendarIcon className="inline w-4 h-4 mr-1" />
            Дата рождения
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        {/* Время рождения */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            <ClockIcon className="inline w-4 h-4 mr-1" />
            Время рождения
          </label>
          <div className="space-y-3">
            <input
              type="time"
              value={formData.birthTime}
              onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
              disabled={formData.timeUnknown}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors disabled:bg-neutral-100 disabled:text-neutral-500"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.timeUnknown}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  timeUnknown: e.target.checked,
                  birthTime: e.target.checked ? '12:00' : prev.birthTime
                }))}
                className="w-4 h-4 text-purple-600 border-neutral-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-neutral-600">Не знаю точное время</span>
            </label>
          </div>
        </div>

        {/* Место рождения */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            <MapPinIcon className="inline w-4 h-4 mr-1" />
            Место рождения
          </label>
          <div className="relative">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                handleLocationSearch(e.target.value);
              }}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Начните вводить город..."
              required
            />
            
            {isLoadingLocation && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
              </div>
            )}
            
            {locationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {locationSuggestions.map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none first:rounded-t-xl last:rounded-b-xl transition-colors"
                  >
                    <div className="font-medium text-neutral-900">{location.name}</div>
                    <div className="text-sm text-neutral-500">{location.timezone}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {formData.location && (
            <div className="mt-2 p-3 bg-purple-50 rounded-xl">
              <div className="text-sm text-purple-800 font-medium">{formData.location.name}</div>
              <div className="text-xs text-purple-600">
                {formData.location.lat.toFixed(2)}°, {formData.location.lon.toFixed(2)}° • {formData.location.timezone}
              </div>
            </div>
          )}
        </div>

        {/* Дополнительные настройки */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-purple-600 hover:text-purple-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Дополнительно
          <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="space-y-4 p-4 bg-neutral-50 rounded-xl animate-fadeIn">
            {formData.location ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Координаты</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      step="0.01"
                      min="-90"
                      max="90"
                      value={formData.location.lat}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: prev.location ? { ...prev.location, lat: parseFloat(e.target.value) } : null
                      }))}
                      className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Широта"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="-180"
                      max="180"
                      value={formData.location.lon}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: prev.location ? { ...prev.location, lon: parseFloat(e.target.value) } : null
                      }))}
                      className="px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Долгота"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Часовой пояс (UTC)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="-14"
                    max="14"
                    value={formData.location.tzOffset}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: prev.location ? { ...prev.location, tzOffset: parseFloat(e.target.value) } : null
                    }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="например, 3"
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-neutral-500">Сначала выберите место рождения</p>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Система домов
              </label>
              <select
                value={formData.houseSystem}
                onChange={(e) => setFormData(prev => ({ ...prev, houseSystem: e.target.value as 'P' | 'W' }))}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="P">Плацидус (Placidus)</option>
                <option value="W">Целые знаки (Whole Sign)</option>
              </select>
            </div>
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isLoading || !formData.location}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Сохранение...
            </div>
          ) : (
            'Создать карту'
          )}
        </button>
      </form>
    </div>
  );
}