import React from 'react';
import { useTelegramFullscreen } from '../hooks/useTelegramFullscreen';

export default function FullscreenStatus() {
  const { isExpanded, isExpanding, isTelegramEnvironment } = useTelegramFullscreen();

  // Only show in Telegram environment
  if (!isTelegramEnvironment) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
        isExpanding 
          ? 'bg-yellow-500/80 text-yellow-900' 
          : isExpanded 
            ? 'bg-green-500/80 text-green-900' 
            : 'bg-gray-500/80 text-gray-900'
      }`}>
        {isExpanding ? '⏳ Расширение...' : isExpanded ? '✅ Полноэкранный' : '📱 Обычный'}
      </div>
    </div>
  );
}