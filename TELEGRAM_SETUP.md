# Настройка Telegram Web App для ASTROT

## Описание
ASTROT - это полноэкранное Telegram Web App для создания натальных карт с астрологом Котеусом.

## Особенности
- ✅ Полноэкранный режим Telegram Web App
- ✅ Отображение информации о пользователе (ID, имя, аватарка)
- ✅ Космический дизайн с анимациями
- ✅ Интеграция с Telegram Bot API
- ✅ Адаптивный дизайн для мобильных устройств

## Настройка Telegram Bot

### 1. Создание бота
1. Найдите @BotFather в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните токен бота

### 2. Настройка Web App
Отправьте @BotFather команду `/setmenubutton` и настройте:
```
Bot: @your_bot_username
Menu Button URL: https://your-domain.com
```

### 3. Настройка команд
Отправьте @BotFather команду `/setcommands`:
```
start - Запустить ASTROT
natal - Построить натальную карту
help - Помощь
```

## Развертывание

### Локальная разработка
```bash
npm install
npm run dev
```

### Продакшн
```bash
npm run build
```

### Хостинг
Рекомендуется использовать:
- Vercel
- Netlify
- GitHub Pages

## Структура проекта

```
src/
├── components/
│   ├── TelegramUserInfo.jsx    # Информация о пользователе
│   ├── KoteusAstrolog.jsx      # Астролог Котеус
│   ├── StarField.tsx           # Анимированные звезды
│   └── TelegramWrapper.jsx     # Обертка Telegram
├── lib/
│   └── telegram-init.js        # Инициализация Telegram SDK
├── pages/
│   ├── MainPage.jsx            # Главная страница
│   ├── NatalFormPage.jsx       # Форма натальной карты
│   └── NatalResultPage.jsx     # Результат
└── App.tsx                     # Основной компонент
```

## Telegram Web App API

### Инициализация
```javascript
import { initTelegramSDK, getTelegramUser } from './lib/telegram-init';

// Инициализация
const webApp = initTelegramSDK();

// Получение информации о пользователе
const user = getTelegramUser();
```

### Основные методы
- `webApp.ready()` - Готовность приложения
- `webApp.expand()` - Полноэкранный режим
- `webApp.setHeaderColor()` - Цвет заголовка
- `webApp.setBackgroundColor()` - Цвет фона

## Стили и темы

### Цветовая схема
- Основной фон: `#0f0f23`
- Вторичный фон: `#1a1a2e`
- Акцентный цвет: `#00ffff`
- Текст: `#ffffff`

### Анимации
- `twinkle` - Мерцание звезд
- `neon-pulse` - Неоновое свечение
- `cosmic-float` - Космическое движение

## Безопасность

### Проверка инициализации
```javascript
if (!isTelegramWebApp()) {
  console.warn('Not running in Telegram WebApp environment');
  return;
}
```

### Валидация данных
Все данные от Telegram должны быть проверены на сервере.

## Производительность

### Оптимизации
- Использование `useMemo` для звездного поля
- `useCallback` для функций
- Оптимизированные анимации
- Ленивая загрузка компонентов

### Мониторинг
- Отслеживание времени загрузки
- Мониторинг ошибок
- Аналитика использования

## Поддержка

### Известные проблемы
1. Некоторые браузеры могут не поддерживать backdrop-filter
2. Анимации могут быть отключены в настройках устройства

### Решения
1. Fallback стили для старых браузеров
2. Проверка поддержки анимаций
3. Адаптивные стили

## Лицензия
MIT License

## Автор
Котеус - Космический Астролог