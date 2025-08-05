// Telegram Mini App SDK Initialization Wrapper
// This prevents errors when running outside Telegram environment

export const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && 
         window.Telegram && 
         window.Telegram.WebApp;
};

export const initTelegramSDK = () => {
  // Only initialize if we're in Telegram environment
  if (!isTelegramWebApp()) {
    console.warn('Not running in Telegram WebApp environment');
    return null;
  }

  try {
    // Initialize Telegram WebApp
    window.Telegram.WebApp.ready();
    return window.Telegram.WebApp;
  } catch (error) {
    console.error('Failed to initialize Telegram SDK:', error);
    return null;
  }
};

// Mock Telegram WebApp for development
export const mockTelegramWebApp = () => {
  if (typeof window === 'undefined') return;
  
  if (!window.Telegram) {
    window.Telegram = {
      WebApp: {
        ready: () => {},
        close: () => {},
        expand: () => {},
        MainButton: {
          text: '',
          show: () => {},
          hide: () => {},
          enable: () => {},
          disable: () => {},
          onClick: () => {},
          offClick: () => {},
        },
        HapticFeedback: {
          impactOccurred: () => {},
          notificationOccurred: () => {},
          selectionChanged: () => {},
        },
        showAlert: () => {},
        showConfirm: () => {},
        initData: '',
        initDataUnsafe: {},
        version: '6.0',
        platform: 'unknown',
        colorScheme: 'light',
        themeParams: {},
        isExpanded: false,
        viewportHeight: window.innerHeight,
        viewportStableHeight: window.innerHeight,
        headerColor: '#ffffff',
        backgroundColor: '#ffffff',
        BackButton: {
          show: () => {},
          hide: () => {},
          onClick: () => {},
          offClick: () => {},
        }
      }
    };
  }
};