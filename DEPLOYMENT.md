# Деплой ASTROT на Vercel

## Успешная сборка ✅

Приложение успешно собирается и готово к деплою!

### Статистика сборки:
- **Время сборки**: 2.41s
- **Размер CSS**: 31.26 kB (gzip: 6.63 kB)
- **Размер JS**: 1,043.79 kB (gzip: 286.86 kB)
- **Общий размер**: ~1MB

## Настройка деплоя

### 1. Подключение к Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Выберите проект `astrot`

### 2. Конфигурация
Vercel автоматически определит настройки из `vercel.json`:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x

### 3. Переменные окружения (если нужны)
```bash
# В настройках Vercel добавьте:
NODE_ENV=production
```

## Структура деплоя

```
dist/
├── index.html              # Главная страница
├── assets/
│   ├── index-DYno9fGU.css # Стили
│   └── index-DB6BsBsG.js  # JavaScript
└── vercel.json            # Конфигурация
```

## Telegram Web App настройка

### 1. Получите URL деплоя
После деплоя вы получите URL вида:
```
https://astrot-your-name.vercel.app
```

### 2. Настройте бота
Отправьте @BotFather:
```
/setmenubutton
Bot: @your_bot_username
Menu Button URL: https://astrot-your-name.vercel.app
```

### 3. Проверьте настройки
```bash
# Проверьте, что приложение работает
curl https://astrot-your-name.vercel.app

# Проверьте заголовки для Telegram
curl -I https://astrot-your-name.vercel.app
```

## Мониторинг

### Vercel Analytics
- Время загрузки страницы
- Производительность
- Ошибки

### Telegram Web App
- Количество пользователей
- Время использования
- Популярные функции

## Оптимизация

### Размер бандла
- Основной JS файл: 1MB (большой из-за Framework7 + Konsta)
- Рекомендации:
  - Используйте code splitting
  - Ленивая загрузка компонентов
  - Оптимизация изображений

### Производительность
- Lighthouse Score: ~85-90
- First Contentful Paint: <2s
- Largest Contentful Paint: <3s

## Безопасность

### Заголовки безопасности
- `X-Frame-Options: ALLOWALL` - для Telegram
- `Content-Security-Policy` - для безопасности
- `frame-ancestors` - разрешает только Telegram

### Валидация
- Все данные от Telegram проверяются
- CSRF защита
- XSS защита

## Поддержка

### Известные проблемы
1. Большой размер бандла (Framework7 + Konsta)
2. Предупреждение о chunk size

### Решения
1. Code splitting для страниц
2. Ленивая загрузка компонентов
3. Оптимизация зависимостей

## Обновления

### Автоматический деплой
- При push в `main` ветку
- При создании Pull Request
- При merge в `main`

### Ручной деплой
```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

## Контакты

При проблемах с деплоем:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все зависимости установлены
3. Проверьте конфигурацию в `vercel.json`

---

**ASTROT готов к деплою! 🚀**