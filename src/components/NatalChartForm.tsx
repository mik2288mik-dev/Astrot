'use client';

import React, { useState, useEffect } from 'react';

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
}

export default function NatalChartForm({ onSubmit }: NatalChartFormProps) {
  const [form, setForm] = useState<NatalFormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    timeUnknown: false,
    location: null,
  });
  const [touched, setTouched] = useState<{ [K in keyof NatalFormData]?: boolean }>({});
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    `w-full px-4 py-2 text-lg rounded-2xl border min-h-[44px] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-pastel-purple ${
      touched[field] && errors[field]
        ? 'border-pastel-pink bg-pastel-pink/30'
        : 'border-pastel-purple bg-pastel-cream'
    } ${extra}`;

  const selectPlace = (s: PlaceSuggestion) => {
    setForm(prev => ({ ...prev, location: { name: s.display_name, lat: parseFloat(s.lat), lon: parseFloat(s.lon) } }));
    setQuery(s.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[90%] max-w-[320px] mx-auto p-6 pb-8 flex flex-col bg-gradient-to-b from-pastel-purple to-pastel-pink rounded-3xl shadow-soft"
    >
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-base text-neutral-800">
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
          <label htmlFor="date" className="mb-1 text-base text-neutral-800">
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
            <label htmlFor="time" className="mb-1 text-base text-neutral-800">
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
          <div className="flex items-center">
            <input
              id="timeUnknown"
              type="checkbox"
              checked={form.timeUnknown}
              onChange={e => {
                handleChange('timeUnknown', e.target.checked);
                if (e.target.checked) handleChange('birthTime', '');
              }}
              className="mr-2"
            />
            <label htmlFor="timeUnknown" className="text-base text-neutral-800">
              Не знаю время
            </label>
          </div>
          {form.timeUnknown && (
            <p className="mt-1 text-xs text-neutral-500">Будет использовано 12:00</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="place" className="mb-1 text-base text-neutral-800">
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
        className="w-full mt-6 min-h-[44px] text-lg font-semibold text-neutral-800 bg-gradient-to-r from-pastel-purple to-pastel-pink rounded-2xl disabled:opacity-50"
        disabled={errors.name || errors.birthDate || errors.birthTime || errors.location}
      >
        Рассчитать карту
      </button>
    </form>
  );
}

