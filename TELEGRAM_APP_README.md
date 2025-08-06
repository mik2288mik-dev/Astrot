# 🌟 ASTROT - Telegram Mini Web App для Астрологии

Полностью рабочий Telegram Mini Web App для астрологических расчетов с красивым UI и интеграцией платежей через Telegram Stars.

## ✨ Что реализовано

### 📱 Экраны приложения
- **LoadingScreen** - экран загрузки с анимацией спиннера и инициализацией Telegram WebApp
- **MainMenu** - главное меню с информацией пользователя и навигацией
- **NatalForm** - форма для ввода данных натальной карты
- **NatalResultScreen** - интерактивное отображение результатов натальной карты
- Заглушки для других экранов (Гороскоп, Игры, Профиль)

### 🎨 Дизайн и анимации
- Красивые SVG изображения для всех элементов интерфейса
- Космическая тема с градиентами и анимациями
- Анимированный кот, меняющий позы каждые 5 секунд
- Плавные переходы и hover-эффекты
- Адаптивный дизайн для мобильных устройств

### 🚀 Функциональность
- **Telegram WebApp API** - полная интеграция с Telegram
- **Монетизация** - готовая система оплаты через Telegram Stars
- **API сервис** - с заглушками для демонстрации
- **Натальная карта** - интерактивная SVG визуализация
- **Типизация TypeScript** - полная типизация всех компонентов

### 🛠 Технологии
- **React 18** + **TypeScript**
- **Vite** для быстрой сборки
- **TailwindCSS** для стилизации
- **Framework7** для мобильного UI
- **Telegram WebApp SDK**

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск в режиме разработки
```bash
npm run dev
```

### 3. Сборка для продакшена
```bash
npm run build
```

### 4. Просмотр сборки
```bash
npm run preview
```

## 📁 Структура проекта

```
src/
├── components/
│   ├── LoadingScreen.tsx      # Экран загрузки
│   ├── MainMenu.tsx           # Главное меню
│   ├── NatalForm.tsx          # Форма натальной карты
│   └── NatalResultScreen.tsx  # Результаты натальной карты
├── services/
│   ├── ApiService.ts          # API сервис
│   └── Monetization.ts        # Система платежей
├── types/
│   └── telegram.ts            # Типы для Telegram WebApp
├── App.tsx                    # Главный компонент
├── main.tsx                   # Точка входа
└── index.css                  # Стили и анимации

public/assets/
├── bg-loading.svg             # Фон загрузки
├── bg-main.svg                # Главный фон
├── spinner.svg                # Спиннер загрузки
├── cat-pose-1.svg             # Кот в разных позах
├── cat-pose-2.svg
├── cat-pose-3.svg
├── cat-pose-4.svg
├── button-natal.svg           # Кнопки навигации
├── button-horoscope.svg
├── button-games.svg
├── button-profile.svg
└── button-premium.svg
```

## 🔧 Настройка для Telegram

### 1. Создайте бота через @BotFather
```
/newbot
```

### 2. Получите токен бота

### 3. Настройте Menu Button
```
/setmenubutton
```

### 4. Укажите URL вашего Web App
```
https://your-domain.com
```

### 5. Настройте переменные окружения
Создайте `.env` файл:
```
VITE_API_URL=https://your-backend-api.com/api
```

## 💰 Настройка платежей

### 1. Подключите Telegram Stars
Для работы с платежами через Telegram Stars настройте:
- Провайдера платежей в @BotFather
- Webhook для обработки платежей
- Создание invoice через Bot API

### 2. Пример создания invoice
```javascript
// Через Bot API
POST https://api.telegram.org/bot<TOKEN>/createInvoiceLink
{
  "title": "Премиум доступ",
  "description": "Полный доступ к астрологическим функциям",
  "payload": "premium_access",
  "provider_token": "", // Пустой для Telegram Stars
  "currency": "XTR", // Telegram Stars
  "prices": [{"label": "Премиум", "amount": 100}]
}
```

## 🎯 Особенности реализации

### 1. Telegram WebApp интеграция
- Автоматическая инициализация при загрузке
- Настройка темы и цветов
- Обработка кнопки "Назад"
- Получение данных пользователя

### 2. Анимации
- CSS keyframes для плавных переходов
- SVG анимации для интерактивных элементов
- Автоматическая смена поз кота
- Космические эффекты и частицы

### 3. Натальная карта
- SVG визуализация с 12 домами
- Интерактивные планеты
- Детальная информация при клике
- Адаптивный размер под экран

### 4. Система платежей
- Готовая интеграция с Telegram Stars
- Управление статусом подписки
- Локальное кэширование премиум функций
- Обработка различных статусов платежа

## 🐛 Решение проблем

### Telegram WebApp не работает в браузере
Telegram WebApp API работает только внутри Telegram. Для разработки используйте:
- Telegram Desktop с Developer Tools
- Telegram Web с открытыми инструментами разработчика
- Или создайте заглушки для тестирования

### Ошибки TypeScript
Все типы для Telegram WebApp определены в `src/types/telegram.ts`. При необходимости добавьте дополнительные типы.

### Проблемы с анимациями
Анимации оптимизированы для мобильных устройств. Если есть проблемы с производительностью, можно отключить анимации через CSS:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

## 📚 Дополнительные ресурсы

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram WebApp Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Stars Payment](https://core.telegram.org/bots/payments#stars)
- [Framework7 Documentation](https://framework7.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🎉 Что дальше?

Приложение готово к расширению:

1. **Подключите реальный API** для астрологических расчетов
2. **Добавьте базу данных** для сохранения пользователей и карт
3. **Реализуйте остальные экраны** (Гороскоп, Игры, Профиль)
4. **Настройте аналитику** для отслеживания использования
5. **Добавьте push-уведомления** через Telegram Bot

Удачи в развитии вашего астрологического Telegram Mini Web App! 🌟

---

*Создано с любовью для изучения Telegram Mini Apps 💜*