'use client';

import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { PaintBrushIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isThemeEnabled, toggleTheme, currentTheme } = useTheme();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <PaintBrushIcon className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            Праздничные оформления
          </h3>
          <p className="text-sm text-gray-500">
            {isThemeEnabled 
              ? `Активна: ${currentTheme.title}`
              : 'Базовая тема'
            }
          </p>
        </div>
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isThemeEnabled}
          onChange={toggleTheme}
          className="sr-only peer"
          aria-describedby="theme-toggle-description"
        />
        <div 
          className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
          role="switch"
          aria-checked={isThemeEnabled}
        ></div>
        <span id="theme-toggle-description" className="sr-only">
          {isThemeEnabled ? 'Отключить праздничные оформления' : 'Включить праздничные оформления'}
        </span>
      </label>
    </div>
  );
}