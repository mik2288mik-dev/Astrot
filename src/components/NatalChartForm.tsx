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
    `w-full p-4 text-lg rounded-2xl border focus:outline-none focus:ring-2 focus:ring-purple-300 ${
      touched[field] && errors[field]
        ? 'border-pink-300 bg-pink-50'
        : 'border-purple-200 bg-white'
    } ${extra}`;

  const selectPlace = (s: PlaceSuggestion) => {
    setForm(prev => ({ ...prev, location: { name: s.display_name, lat: parseFloat(s.lat), lon: parseFloat(s.lon) } }));
    setQuery(s.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-b from-purple-50 to-pink-50 p-8 rounded-3xl shadow-md">
      <div>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, name: true }))}
          placeholder="Имя"
          className={inputClass('name')}
        />
      </div>

      <div>
        <input
          id="date"
          type="date"
          value={form.birthDate}
          onChange={e => handleChange('birthDate', e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, birthDate: true }))}
          className={inputClass('birthDate')}
        />
      </div>

      <div>
        <input
          id="time"
          type="time"
          value={form.birthTime}
          onChange={e => handleChange('birthTime', e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, birthTime: true }))}
          disabled={form.timeUnknown}
          className={inputClass('birthTime', form.timeUnknown ? 'disabled:bg-gray-100' : '')}
        />
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.timeUnknown}
            onChange={e => {
              handleChange('timeUnknown', e.target.checked);
              if (e.target.checked) handleChange('birthTime', '');
            }}
          />
          <span>Не знаю время</span>
        </label>
        {form.timeUnknown && (
          <p className="text-xs text-neutral-500 mt-1">Будет использовано 12:00</p>
        )}
      </div>

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
          placeholder="Место рождения"
          className={inputClass('location')}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="absolute z-10 w-full mt-2 bg-white border border-purple-100 rounded-xl shadow-lg"
            data-testid="suggestions"
          >
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectPlace(s)}
                className="block w-full text-left px-4 py-2 hover:bg-purple-50"
                data-testid="suggestion-item"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
        disabled={errors.name || errors.birthDate || errors.birthTime || errors.location}
      >
        Рассчитать карту
      </button>
    </form>
  );
}

