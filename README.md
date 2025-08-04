# Astrot - Telegram Mini App

Telegram Mini App с полноценной авторизацией через Telegram и автоматической загрузкой данных пользователя.

## Возможности

✅ **Автоматическая авторизация через Telegram**
- Мгновенная загрузка данных пользователя при входе
- Получение ID, имени, фамилии, username
- Загрузка аватара пользователя
- Определение Premium статуса
- Поддержка языковых настроек

✅ **Полная интеграция с Telegram Web App API**
- Отправка данных в Telegram
- Запрос контактов пользователя
- Чтение буфера обмена
- Показ алертов и подтверждений
- Открытие ссылок

✅ **Современный UI/UX**
- Адаптивный дизайн для iOS и Android
- Поддержка темной и светлой темы
- Красивые компоненты с Konsta UI
- Анимации и переходы

✅ **Управление состоянием**
- Контекст для авторизации
- Персистентность данных в localStorage
- Обработка ошибок
- Состояния загрузки

## Структура проекта

```
src/
├── lib/
│   ├── telegram-auth.tsx      # Контекст авторизации
│   └── use-telegram-api.ts    # Хук для работы с Telegram API
├── components/
│   ├── UserProfile.tsx        # Компонент профиля пользователя
│   ├── LoadingScreen.tsx      # Экран загрузки
│   └── ErrorScreen.tsx        # Экран ошибок
app/
├── layout.tsx                 # Корневой layout с провайдером
├── page.tsx                   # Главная страница
└── profile/
    └── page.tsx              # Страница профиля
types/
└── telegram.d.ts             # Типы для Telegram Web App
```

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите проект в режиме разработки:
```bash
npm run dev
```

3. Откройте [http://localhost:3000](http://localhost:3000) в браузере

## Использование

### Основные компоненты

#### TelegramAuthProvider
Провайдер для управления состоянием авторизации:

```tsx
import { TelegramAuthProvider } from '../src/lib/telegram-auth';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TelegramAuthProvider>
          {children}
        </TelegramAuthProvider>
      </body>
    </html>
  );
}
```

#### useTelegramAuth
Хук для получения данных авторизации:

```tsx
import { useTelegramAuth } from '../src/lib/telegram-auth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, error, logout } = useTelegramAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!isAuthenticated) return <AuthScreen />;
  
  return <UserProfile user={user} onLogout={logout} />;
}
```

#### useTelegramApi
Хук для работы с Telegram API:

```tsx
import { useTelegramApi } from '../src/lib/use-telegram-api';

function MyComponent() {
  const { sendData, showAlert, requestContact, readClipboard } = useTelegramApi();
  
  const handleSendData = async () => {
    await sendData(JSON.stringify({ action: 'test' }));
    showAlert('Данные отправлены!');
  };
  
  return <button onClick={handleSendData}>Отправить данные</button>;
}
```

### Данные пользователя

При авторизации автоматически загружаются следующие данные:

```typescript
interface TelegramUser {
  id: number;                    // ID пользователя
  first_name: string;           // Имя
  last_name?: string;           // Фамилия
  username?: string;            // Username
  language_code?: string;       // Код языка
  is_premium?: boolean;         // Premium статус
  photo_url?: string;           // URL аватара
}
```

### Функции Telegram API

- `sendData(data)` - Отправка данных в Telegram
- `showAlert(message)` - Показ алерта
- `showConfirm(message)` - Показ подтверждения
- `requestContact()` - Запрос контакта пользователя
- `readClipboard()` - Чтение буфера обмена
- `openLink(url)` - Открытие ссылки

## Настройка для продакшена

1. Создайте бота в Telegram через @BotFather
2. Получите токен бота
3. Настройте Web App в настройках бота
4. Укажите URL вашего приложения
5. Настройте домен в настройках бота

## Технологии

- **Next.js 15** - React фреймворк
- **Framework7** - UI фреймворк для мобильных приложений
- **Konsta UI** - Компоненты для мобильных приложений
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Telegram Web App API** - Интеграция с Telegram

## Лицензия

MIT
