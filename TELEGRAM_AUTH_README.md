# Telegram Авторизация для AstroT

## Обзор

Система авторизации через Telegram Mini App с автоматической загрузкой данных пользователя, включая ID, имя, аватар и другие параметры.

## Возможности

✅ **Автоматическая авторизация** - пользователь автоматически авторизуется при входе в приложение  
✅ **Загрузка данных пользователя** - ID, имя, фамилия, username, аватар  
✅ **Premium статус** - отображение Premium статуса пользователя  
✅ **Адаптивная тема** - автоматическое переключение между светлой и темной темой  
✅ **Haptic feedback** - тактильная обратная связь для мобильных устройств  
✅ **Главная кнопка** - настраиваемая главная кнопка Telegram  
✅ **Детальная информация** - полная информация о пользователе и приложении  

## Структура файлов

```
src/
├── lib/
│   ├── telegram-auth.tsx    # Контекст авторизации
│   └── use-telegram.ts      # Хук для работы с Telegram API
├── components/
│   ├── UserProfile.tsx      # Компонент профиля пользователя
│   └── UserDetails.tsx      # Детальная информация о пользователе
types/
└── telegram.d.ts            # TypeScript типы
```

## Использование

### 1. Основной провайдер

В `app/layout.tsx` уже настроены провайдеры:

```tsx
import { TelegramAuthProvider } from "@/lib/telegram-auth";

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <TelegramAuthProvider>
          {children}
        </TelegramAuthProvider>
      </body>
    </html>
  );
}
```

### 2. Использование в компонентах

```tsx
import { useTelegramAuth } from '@/lib/telegram-auth';
import { useTelegram } from '@/lib/use-telegram';

function MyComponent() {
  const { user, isAuthorized, isLoading, error } = useTelegramAuth();
  const { showMainButton, hapticFeedback, showAlert } = useTelegram();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!isAuthorized) return <div>Не авторизован</div>;

  return (
    <div>
      <h1>Привет, {user?.first_name}!</h1>
      <p>Ваш ID: {user?.id}</p>
      {user?.is_premium && <p>🌟 Premium пользователь</p>}
    </div>
  );
}
```

### 3. Компоненты профиля

```tsx
import { UserProfileCard } from '@/components/UserProfile';
import { UserDetails } from '@/components/UserDetails';

// Компактная карточка профиля
<UserProfileCard />

// Детальная информация
<UserDetails />
```

## Доступные данные пользователя

```typescript
interface TelegramUser {
  id: number;                    // ID пользователя
  first_name: string;            // Имя
  last_name?: string;            // Фамилия
  username?: string;             // Username (@username)
  photo_url?: string;            // URL аватара
  language_code?: string;        // Код языка (ru, en, etc.)
  is_premium?: boolean;          // Premium статус
  added_to_attachment_menu?: boolean;  // Доступ к меню вложений
  allows_write_to_pm?: boolean;  // Разрешение на ЛС
}
```

## Telegram WebApp API

### Основные методы

```tsx
const { 
  showMainButton,    // Показать главную кнопку
  hideMainButton,    // Скрыть главную кнопку
  hapticFeedback,    // Тактильная обратная связь
  showAlert,         // Показать алерт
  showConfirm,       // Показать подтверждение
  expand,            // Развернуть приложение
  close,             // Закрыть приложение
  openLink,          // Открыть ссылку
  sendData,          // Отправить данные в бота
} = useTelegram();
```

### Примеры использования

```tsx
// Показать главную кнопку
showMainButton('Сохранить', () => {
  hapticFeedback('medium');
  // Логика сохранения
});

// Тактильная обратная связь
hapticFeedback('light');   // Легкое нажатие
hapticFeedback('medium');  // Среднее нажатие
hapticFeedback('heavy');   // Сильное нажатие

// Показать алерт
await showAlert('Данные сохранены!');

// Показать подтверждение
const confirmed = await showConfirm('Удалить запись?');
if (confirmed) {
  // Логика удаления
}
```

## Состояние авторизации

```typescript
interface TelegramAuthState {
  user: TelegramUser | null;           // Данные пользователя
  isAuthorized: boolean;               // Статус авторизации
  isLoading: boolean;                  // Загрузка
  error: string | null;                // Ошибка
  theme: 'light' | 'dark';             // Тема
  colorScheme: 'light' | 'dark';       // Цветовая схема
  platform: 'ios' | 'android' | 'web'; // Платформа
  viewport: {                          // Размеры экрана
    height: number;
    width: number;
    is_expanded: boolean;
  };
}
```

## Обработка ошибок

```tsx
const { error, isLoading } = useTelegramAuth();

if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return (
    <div className="error">
      <h3>Ошибка авторизации</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>
        Попробовать снова
      </button>
    </div>
  );
}
```

## Настройка для продакшена

1. **Создайте бота** в @BotFather
2. **Настройте Web App** в настройках бота
3. **Добавьте домен** в список разрешенных доменов
4. **Настройте SSL** (обязательно для Telegram WebApp)

## Пример конфигурации бота

```
/setmenubutton
Выберите бота: @your_bot_name
Введите текст кнопки: Открыть AstroT
Введите URL: https://your-domain.com
```

## Безопасность

- Все данные пользователя передаются через защищенное соединение
- Telegram автоматически проверяет подлинность данных
- Используйте `initData` для проверки валидности запросов

## Поддержка

При возникновении проблем:

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что приложение открыто через Telegram
3. Проверьте настройки бота в @BotFather
4. Убедитесь, что домен добавлен в разрешенные

## Дополнительные возможности

- **Адаптивный дизайн** - автоматическая адаптация под размер экрана
- **Анимации** - плавные переходы и анимации
- **Темы** - поддержка светлой и темной темы
- **Мультиязычность** - поддержка разных языков
- **Accessibility** - поддержка доступности