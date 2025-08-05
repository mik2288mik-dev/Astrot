import React from 'react';
import { useTelegramFullscreen } from '../hooks/useTelegramFullscreen';

export default function FullscreenButton() {
  const { isExpanded, isExpanding, expandToFullscreen, isTelegramEnvironment } = useTelegramFullscreen();

  // Only show in Telegram environment
  if (!isTelegramEnvironment) {
    return null;
  }

  // Don't show if already expanded
  if (isExpanded) {
    return null;
  }

  return (
    <button
      onClick={expandToFullscreen}
      className={`fullscreen-btn ${isExpanding ? 'animate-pulse' : ''}`}
      title="Перейти в полноэкранный режим"
      disabled={isExpanding}
    >
      {isExpanding ? '⏳' : '⛶'}
    </button>
  );
}