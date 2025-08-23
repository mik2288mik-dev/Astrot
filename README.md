# Astrot - Telegram Mini App

Астрологическое приложение для Telegram Mini Apps с натальными картами, гороскопами и персонализированными прогнозами.

## 📁 Структура проекта

```
/workspace
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API роуты
│   │   ├── home/            # Главная страница
│   │   ├── horoscope/       # Гороскопы
│   │   ├── natal/           # Натальные карты
│   │   ├── chart/           # Построение карт
│   │   ├── profile/         # Профиль пользователя
│   │   └── ...              # Другие страницы
│   │
│   ├── components/          # React компоненты
│   │   ├── layout/          # TopBar, BottomNav, SafeArea
│   │   ├── features/        # Функциональные компоненты (карты, формы)
│   │   ├── shared/          # Переиспользуемые компоненты
│   │   ├── ui/              # UI компоненты
│   │   └── ...              # Другие компоненты
│   │
│   ├── lib/                 # Утилиты и хелперы
│   │   ├── astro/           # Астрологические вычисления
│   │   ├── auth/            # Авторизация через Telegram
│   │   ├── db/              # База данных
│   │   └── ...              # Другие утилиты
│   │
│   ├── services/            # API сервисы
│   ├── hooks/               # React хуки
│   ├── providers/           # React провайдеры
│   ├── types/               # TypeScript типы
│   └── styles/              # Глобальные стили
│
├── public/                  # Статические файлы
│   └── assets/              
│       ├── icons/           # Иконки приложения
│       └── backgrounds/     # Фоновые изображения
│
├── prisma/                  # Prisma схема и миграции
├── supabase/               # Supabase конфигурация
├── ephe/                   # Эфемериды для астрологических расчетов
└── legacy/                 # Архив старых файлов для справки

```

## 🚀 Установка и запуск

```bash
# Установка зависимостей
pnpm install

# Генерация Prisma клиента
pnpm prisma generate

# Запуск в режиме разработки
pnpm dev

# Сборка для продакшена
pnpm build

# Запуск продакшен сборки
pnpm start
```

## 🛠 Технологии

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Prisma** - ORM для базы данных
- **Supabase** - Backend as a Service
- **Telegram Mini Apps SDK** - Интеграция с Telegram
- **Astronomy Engine** - Астрологические вычисления

## 📝 Скрипты

- `pnpm dev` - Запуск dev сервера
- `pnpm build` - Сборка проекта
- `pnpm start` - Запуск production сервера
- `pnpm lint` - Проверка кода линтером
- `pnpm format` - Форматирование кода
- `pnpm typecheck` - Проверка типов

## 🔧 Конфигурация

- `tsconfig.json` - Настройки TypeScript
- `tailwind.config.ts` - Настройки Tailwind CSS
- `next.config.mjs` - Настройки Next.js
- `prisma/schema.prisma` - Схема базы данных

## 📦 Основные зависимости

- React 18.3
- Next.js 14.2
- Prisma 6.14
- Supabase 2.56
- Telegram Apps SDK 1.1

## 🎨 Дизайн система

Проект использует современную дизайн систему с поддержкой светлой и темной тем, адаптированную под Telegram Mini Apps.