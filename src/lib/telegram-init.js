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
    const webApp = window.Telegram.WebApp;
    
    // Call ready() first
    webApp.ready();
    
    // Set theme colors before expanding
    webApp.setHeaderColor('#1a1a2e');
    webApp.setBackgroundColor('#0f0f23');
    
    // Enable fullscreen mode with delay to ensure proper initialization
    setTimeout(() => {
      try {
        if (!webApp.isExpanded) {
          webApp.expand();
          console.log('Telegram WebApp expanded to fullscreen');
        }
      } catch (expandError) {
        console.error('Failed to expand Telegram WebApp:', expandError);
      }
    }, 100);
    
    return webApp;
  } catch (error) {
    console.error('Failed to initialize Telegram SDK:', error);
    return null;
  }
};

// Get user info from Telegram
export const getTelegramUser = () => {
  if (!isTelegramWebApp()) {
    return null;
  }

  try {
    const webApp = window.Telegram.WebApp;
    return webApp.initDataUnsafe?.user || null;
  } catch (error) {
    console.error('Failed to get Telegram user:', error);
    return null;
  }
};

// Force expand to fullscreen
export const forceExpand = () => {
  if (!isTelegramWebApp()) {
    return false;
  }

  try {
    const webApp = window.Telegram.WebApp;
    if (!webApp.isExpanded) {
      webApp.expand();
      console.log('Forced expand to fullscreen');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to force expand:', error);
    return false;
  }
};

// Mock Telegram WebApp for development
export const mockTelegramWebApp = () => {
  if (typeof window === 'undefined') return;
  
  if (!window.Telegram) {
    window.Telegram = {
      WebApp: {
        ready: () => {
          console.log('Mock Telegram WebApp ready');
        },
        close: () => {
          console.log('Mock Telegram WebApp close');
        },
        expand: () => {
          console.log('Mock Telegram WebApp expand');
          // Simulate expansion
          window.Telegram.WebApp.isExpanded = true;
        },
        setHeaderColor: (color) => {
          console.log('Mock Telegram WebApp setHeaderColor:', color);
        },
        setBackgroundColor: (color) => {
          console.log('Mock Telegram WebApp setBackgroundColor:', color);
        },
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
        initDataUnsafe: {
          user: {
            id: 123456789,
            first_name: 'Космический',
            last_name: 'Пользователь',
            username: 'cosmic_user',
            language_code: 'ru',
            photo_url: 'https://via.placeholder.com/150/1a1a2e/ffffff?text=*'
          }
        },
        version: '6.0',
        platform: 'unknown',
        colorScheme: 'dark',
        themeParams: {
          bg_color: '#0f0f23',
          text_color: '#ffffff',
          hint_color: '#888888',
          link_color: '#00ffff',
          button_color: '#1a1a2e',
          button_text_color: '#ffffff'
        },
        isExpanded: false,
        viewportHeight: window.innerHeight,
        viewportStableHeight: window.innerHeight,
        headerColor: '#1a1a2e',
        backgroundColor: '#0f0f23',
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