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

    // Сообщаем о готовности
    webApp.ready();

    // Диагностическая информация
    console.log('Версия:', webApp.version);
    console.log('Платформа:', webApp.platform);
    console.log('Высота до expand:', webApp.viewportHeight);

    const expandApp = () => {
      if (!webApp.isExpanded) {
        console.log('Пытаюсь развернуть...');
        webApp.expand();
      } else {
        console.log('Уже развернуто!');
      }

      setTimeout(() => {
        console.log('Высота после expand:', webApp.viewportHeight);
        console.log('isExpanded:', webApp.isExpanded);

        if (!webApp.isFullscreen) {
          console.log('Запрашиваю fullscreen...');
          webApp.requestFullscreen();
        }
      }, 100);
    };

    // На мобильных платформах немного ждем
    if (webApp.platform === 'ios' || webApp.platform === 'android') {
      setTimeout(expandApp, 50);
    } else {
      expandApp();
    }

    // Отслеживаем изменение fullscreen
    webApp.onEvent('fullscreen_changed', () => {
      console.log('Fullscreen изменен:', webApp.isFullscreen);
      document.body.classList.toggle('fullscreen', webApp.isFullscreen);
    });

    webApp.onEvent('fullscreen_failed', (params) => {
      console.error('Fullscreen не удался:', params.error);
    });

    // Отслеживаем изменение viewport
    webApp.onEvent('viewportChanged', () => {
      console.log('Viewport изменен!');
      console.log('Новая высота:', webApp.viewportHeight);
      console.log('Стабильная высота:', webApp.viewportStableHeight);
      console.log('isExpanded сейчас:', webApp.isExpanded);
    });

    // Set theme colors
    webApp.setHeaderColor('#1a1a2e');
    webApp.setBackgroundColor('#0f0f23');

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

// Mock Telegram WebApp for development
export const mockTelegramWebApp = () => {
  if (typeof window === 'undefined') return;
  
  if (!window.Telegram) {
    window.Telegram = {
      WebApp: {
        ready: () => {},
        close: () => {},
        expand: () => {},
        setHeaderColor: (color) => {},
        setBackgroundColor: (color) => {},
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

export const checkFullscreen = () => {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  console.log('=== FULLSCREEN ДИАГНОСТИКА ===');
  console.log('isExpanded:', tg.isExpanded);
  console.log('isFullscreen:', tg.isFullscreen);
  console.log('viewportHeight:', tg.viewportHeight);
  console.log('viewportStableHeight:', tg.viewportStableHeight);

  if (!tg.isFullscreen) {
    console.log('Пытаюсь войти в fullscreen...');
    tg.requestFullscreen();
    setTimeout(() => {
      console.log('=== ПОСЛЕ FULLSCREEN ===');
      console.log('isFullscreen теперь:', tg.isFullscreen);
      console.log('viewportHeight теперь:', tg.viewportHeight);
    }, 500);
  } else {
    console.log('Уже в fullscreen режиме');
  }
};
