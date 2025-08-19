'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useTelegramUser } from '@/hooks/useTelegram';

interface PlaceResult {
  displayName: string;
  lat: number;
  lon: number;
  country: string;
  cityLikeLabel: string;
  timezone: string;
  tzOffset: number;
}

interface ProfileFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  location: {
    name: string;
    lat: number;
    lon: number;
    timezone: string;
    tzOffset: number;
  } | null;
  houseSystem: 'P' | 'W';
}

const ProfileFormSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(100, 'Имя слишком длинное'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты'),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'Неверный формат времени').optional(),
  unknownTime: z.boolean(),
  location: z.object({
    name: z.string().min(1, 'Место рождения обязательно'),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    timezone: z.string(),
    tzOffset: z.number().min(-14).max(14)
  }),
  houseSystem: z.enum(['P', 'W'])
}).refine((data) => {
  if (!data.unknownTime && !data.birthTime) {
    return false;
  }
  return true;
}, {
  message: 'Время рождения обязательно, если не отмечено "Не знаю время"',
  path: ['birthTime']
});

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void;
  loading?: boolean;
  initialData?: Partial<ProfileFormData>;
  onReset?: () => void;
}

export default function ProfileForm({ onSubmit, loading = false, initialData, onReset }: ProfileFormProps) {
  const { fullName } = useTelegramUser();
  
  const [form, setForm] = useState<ProfileFormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    unknownTime: false,
    location: null,
    houseSystem: 'P'
  });

  const [touched, setTouched] = useState<{ [K in keyof ProfileFormData]?: boolean }>({});
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<PlaceResult[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Initialize form with initial data or Telegram user data
  useEffect(() => {
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }));
      if (initialData.location) {
        setLocationQuery(initialData.location.name);
      }
    } else if (fullName) {
      setForm(prev => ({ ...prev, name: fullName }));
    }
  }, [initialData, fullName]);

  // Debounced location search
  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(async () => {
      if (locationQuery.length < 2) {
        setLocationSuggestions([]);
        return;
      }
      
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(locationQuery)}`, {
          signal: controller.signal
        });
        
        if (res.ok) {
          const data = await res.json();
          setLocationSuggestions(data.places || []);
          setShowLocationSuggestions(true);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Location search error:', error);
        }
      }
    }, 300);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [locationQuery]);

  // Validate form
  const validateForm = () => {
    try {
      const validationData = {
        ...form,
        birthTime: form.unknownTime ? undefined : form.birthTime
      };
      ProfileFormSchema.parse(validationData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    if (!form.name.trim()) return false;
    if (!form.birthDate) return false;
    if (!form.unknownTime && !form.birthTime) return false;
    if (!form.location) return false;
    return true;
  };

  const handleChange = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLocationSelect = (place: PlaceResult) => {
    const location = {
      name: place.displayName,
      lat: place.lat,
      lon: place.lon,
      timezone: place.timezone,
      tzOffset: place.tzOffset
    };
    
    setForm(prev => ({ ...prev, location }));
    setLocationQuery(place.displayName);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
    setTouched(prev => ({ ...prev, location: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      birthDate: true,
      birthTime: true,
      unknownTime: true,
      location: true,
      houseSystem: true
    });
    
    if (validateForm()) {
      onSubmit(form);
    }
  };

  const handleReset = () => {
    setForm({
      name: fullName || '',
      birthDate: '',
      birthTime: '',
      unknownTime: false,
      location: null,
      houseSystem: 'P'
    });
    setLocationQuery('');
    setTouched({});
    setValidationErrors({});
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
    onReset?.();
  };

  const inputClass = (field: keyof ProfileFormData, hasError: boolean = false) =>
    `w-full px-4 py-3 text-base rounded-2xl border min-h-[44px] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-pastel-purple transition-colors ${
      hasError
        ? 'border-red-400 bg-red-50'
        : 'border-pastel-purple bg-pastel-cream'
    }`;

  const labelClass = "block mb-2 text-base font-medium text-neutral-800";

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name field */}
        <div>
          <label htmlFor="name" className={labelClass}>
            Имя *
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Введите ваше имя"
            className={inputClass('name', !!(touched.name && validationErrors.name))}
            maxLength={100}
          />
          {touched.name && validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        {/* Birth Date field */}
        <div>
          <label htmlFor="birthDate" className={labelClass}>
            Дата рождения *
          </label>
          <input
            id="birthDate"
            type="date"
            value={form.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            className={inputClass('birthDate', !!(touched.birthDate && validationErrors.birthDate))}
          />
          {touched.birthDate && validationErrors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.birthDate}</p>
          )}
        </div>

        {/* Birth Time field with Unknown Time checkbox */}
        <div>
          <label htmlFor="birthTime" className={labelClass}>
            Время рождения {!form.unknownTime && '*'}
          </label>
          <div className="space-y-3">
            <input
              id="birthTime"
              type="time"
              value={form.birthTime}
              onChange={(e) => handleChange('birthTime', e.target.value)}
              disabled={form.unknownTime}
              className={inputClass('birthTime', !!(touched.birthTime && validationErrors.birthTime))}
            />
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.unknownTime}
                onChange={(e) => {
                  handleChange('unknownTime', e.target.checked);
                  if (e.target.checked) {
                    handleChange('birthTime', '');
                  }
                }}
                className="w-5 h-5 text-pastel-purple border-2 border-pastel-purple rounded focus:ring-2 focus:ring-pastel-purple"
              />
              <span className="text-sm text-neutral-700">Не знаю точное время</span>
            </label>
          </div>
          {touched.birthTime && validationErrors.birthTime && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.birthTime}</p>
          )}
        </div>

        {/* Location field with autocomplete */}
        <div className="relative">
          <label htmlFor="location" className={labelClass}>
            Место рождения *
          </label>
          <input
            id="location"
            type="text"
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              if (form.location && e.target.value !== form.location.name) {
                handleChange('location', null);
              }
            }}
            placeholder="Введите город или место"
            className={inputClass('location', !!(touched.location && validationErrors.location))}
            autoComplete="off"
          />
          
          {/* Location suggestions dropdown */}
          {showLocationSuggestions && locationSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
              {locationSuggestions.map((place, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSelect(place)}
                  className="w-full text-left px-4 py-3 hover:bg-pastel-cream border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="text-sm font-medium text-neutral-800">
                    {place.cityLikeLabel}
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {place.displayName}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {touched.location && validationErrors.location && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
          )}
          
          {form.location && (
            <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-green-800">
                📍 {form.location.name}
              </p>
              <p className="text-xs text-green-600 mt-1">
                🕐 {form.location.timezone} (UTC{form.location.tzOffset >= 0 ? '+' : ''}{form.location.tzOffset})
              </p>
            </div>
          )}
        </div>

        {/* House System field */}
        <div>
          <label className={labelClass}>
            Система домов *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange('houseSystem', 'P')}
              className={`px-4 py-3 rounded-2xl border-2 transition-colors ${
                form.houseSystem === 'P'
                  ? 'border-pastel-purple bg-pastel-purple text-white'
                  : 'border-pastel-purple bg-pastel-cream text-neutral-800 hover:bg-pastel-purple/20'
              }`}
            >
              Placidus
            </button>
            <button
              type="button"
              onClick={() => handleChange('houseSystem', 'W')}
              className={`px-4 py-3 rounded-2xl border-2 transition-colors ${
                form.houseSystem === 'W'
                  ? 'border-pastel-purple bg-pastel-purple text-white'
                  : 'border-pastel-purple bg-pastel-cream text-neutral-800 hover:bg-pastel-purple/20'
              }`}
            >
              Whole Sign
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
          >
            Новый расчёт
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`flex-1 px-6 py-3 rounded-2xl font-medium transition-colors ${
              isFormValid() && !loading
                ? 'bg-pastel-purple text-white hover:bg-pastel-purple/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Сохранение...' : 'Сохранить профиль'}
          </button>
        </div>
      </form>
    </div>
  );
}