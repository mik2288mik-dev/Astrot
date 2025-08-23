'use client';

import React, { useState, useEffect } from 'react';
import { getLastSavedChart } from '@/lib/birth/storage';
import type { BirthData } from '@/lib/birth/types';

interface PlaceSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface Location {
  name: string;
  lat: number;
  lon: number;
}

export interface NatalFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  timeUnknown: boolean;
  location: Location | null;
}

interface NatalChartFormProps {
  onSubmit: (data: NatalFormData) => void;
  loading?: boolean;
  initialData?: BirthData;
}

export default function NatalChartForm({ onSubmit, loading = false, initialData }: NatalChartFormProps) {
  const [form, setForm] = useState<NatalFormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    timeUnknown: false,
    location: null,
  });
  const [isFromSaved, setIsFromSaved] = useState(false);
  const [touched, setTouched] = useState<{ [K in keyof NatalFormData]?: boolean }>({});
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Предзаполнение формы
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        birthDate: initialData.date,
        birthTime: initialData.unknownTime ? '' : initialData.time,
        timeUnknown: initialData.unknownTime || false,
        location: {
          name: initialData.place.displayName,
          lat: initialData.place.lat,
          lon: initialData.place.lon
        }
      });
      setQuery(initialData.place.displayName);
      setIsFromSaved(true);
    } else {
      // Если нет initialData, проверяем последнюю сохранённую карту
      const lastChart = getLastSavedChart();
      if (lastChart) {
        setForm({
          name: lastChart.input.name || '',
          birthDate: lastChart.input.date,
          birthTime: lastChart.input.unknownTime ? '' : lastChart.input.time,
          timeUnknown: lastChart.input.unknownTime || false,
          location: {
            name: lastChart.input.place.displayName,
            lat: lastChart.input.place.lat,
            lon: lastChart.input.place.lon
          }
        });
        setQuery(lastChart.input.place.displayName);
        setIsFromSaved(true);
      }
    }
  }, [initialData]);

  // search places with debounce
  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (e) {
        console.error('geocode error', e);
      }
    }, 300);
    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [query]);

  const errors: Record<keyof NatalFormData, boolean> = {
    name: form.name.trim() === '',
    birthDate: form.birthDate === '',
    birthTime: !form.timeUnknown && form.birthTime === '',
    timeUnknown: false,
    location: form.location === null,
  };

  const handleChange = <K extends keyof NatalFormData>(
    field: K,
    value: NatalFormData[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, birthDate: true, birthTime: true, location: true });
    if (!errors.name && !errors.birthDate && !errors.birthTime && !errors.location) {
      onSubmit(form);
    }
  };

  const inputClass = (field: keyof NatalFormData, extra: string = '') =>
    `w-full px-4 py-3 text-base rounded-2xl border min-h-[44px] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-pastel-purple ${
      touched[field] && errors[field]
        ? 'border-pastel-pink bg-pastel-pink/30'
        : 'border-pastel-purple bg-pastel-cream'
    } ${extra}`;
  
  const labelClass = "mb-2 text-base font-medium text-neutral-800";

  const selectPlace = (s: PlaceSuggestion) => {
    setForm(prev => ({ ...prev, location: { name: s.display_name, lat: parseFloat(s.lat), lon: parseFloat(s.lon) } }));
    setQuery(s.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleClearForm = () => {
    setForm({
      name: '',
      birthDate: '',
      birthTime: '',
      timeUnknown: false,
      location: null,
    });
    setQuery('');
    setIsFromSaved(false);
    setTouched({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[320px] mx-auto pt-6 pb-6 px-6 flex flex-col bg-gradient-to-b from-pastel-purple to-pastel-pink rounded-3xl shadow-soft"
      >
      
      {isFromSaved && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">📋 Из сохранённой карты</span>
            </div>
            <button
              type="button"
              onClick={handleClearForm}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Очистить
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col" style={{ marginTop: '16px', gap: '20px' }}>
        <div className="flex flex-col">
          <label htmlFor="name" className={labelClass}>
            Имя
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, name: true }))}
            placeholder="Введите имя"
            className={inputClass('name')}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="date" className={labelClass}>
            Дата рождения
          </label>
          <input
            id="date"
            type="date"
            value={form.birthDate}
            onChange={e => handleChange('birthDate', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, birthDate: true }))}
            className={inputClass('birthDate')}
          />
        </div>

        {!form.timeUnknown && (
          <div className="flex flex-col">
            <label htmlFor="time" className={labelClass}>
              Время рождения
            </label>
            <input
              id="time"
              type="time"
              value={form.birthTime}
              onChange={e => handleChange('birthTime', e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, birthTime: true }))}
              className={inputClass('birthTime')}
            />
          </div>
        )}

        <div className="flex flex-col">
          <div className="flex items-baseline">
            <input
              id="timeUnknown"
              type="checkbox"
              checked={form.timeUnknown}
              onChange={e => {
                handleChange('timeUnknown', e.target.checked);
                if (e.target.checked) handleChange('birthTime', '');
              }}
              className="w-4 h-4 rounded border-pastel-purple bg-pastel-cream focus:ring-2 focus:ring-pastel-purple mt-1"
              style={{ marginRight: '10px' }}
            />
            <label htmlFor="timeUnknown" className="text-base font-medium text-neutral-800">
              Не знаю время
            </label>
          </div>
          {form.timeUnknown && (
            <p className="mt-1 text-xs text-neutral-500">Будет использовано 12:00</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="place" className={labelClass}>
            Место рождения
          </label>
          <div className="relative">
            <input
              id="place"
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                handleChange('location', null);
              }}
              onBlur={() => setTouched(t => ({ ...t, location: true }))}
              placeholder="Город, страна"
              className={inputClass('location')}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute z-10 w-full mt-2 bg-pastel-cream border border-pastel-purple rounded-xl shadow-lg"
                data-testid="suggestions"
              >
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectPlace(s)}
                    className="block w-full text-left px-4 py-2 hover:bg-pastel-purple"
                    data-testid="suggestion-item"
                  >
                    {s.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full min-h-[44px] text-base font-semibold text-neutral-800 bg-gradient-to-r from-pastel-purple to-pastel-pink rounded-2xl disabled:opacity-65 disabled:text-neutral-600 transition-all"
        style={{ marginTop: '24px' }}
        disabled={loading || errors.name || errors.birthDate || errors.birthTime || errors.location}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
            Рассчитываем...
          </div>
        ) : (
          'Рассчитать карту'
        )}
      </button>
      </form>
    </div>
  );
}

