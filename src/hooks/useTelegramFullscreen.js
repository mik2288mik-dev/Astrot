import { useEffect, useState } from 'react';
import { isTelegramWebApp, forceExpand } from '../lib/telegram-init';

export const useTelegramFullscreen = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    if (!isTelegramWebApp()) return;

    const webApp = window.Telegram.WebApp;
    
    // Check initial state
    setIsExpanded(webApp.isExpanded);

    // Listen for expansion events
    const checkExpansion = () => {
      setIsExpanded(webApp.isExpanded);
    };

    // Check periodically
    const interval = setInterval(checkExpansion, 1000);

    // Also check on window focus
    const handleFocus = () => {
      setTimeout(checkExpansion, 100);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const expandToFullscreen = () => {
    if (!isTelegramWebApp()) return false;

    setIsExpanding(true);
    
    try {
      const success = forceExpand();
      
      if (success) {
        setIsExpanded(true);
      }
      
      // Reset expanding state after delay
      setTimeout(() => {
        setIsExpanding(false);
      }, 1000);
      
      return success;
    } catch (error) {
      console.error('Failed to expand to fullscreen:', error);
      setIsExpanding(false);
      return false;
    }
  };

  return {
    isExpanded,
    isExpanding,
    expandToFullscreen,
    isTelegramEnvironment: isTelegramWebApp()
  };
};