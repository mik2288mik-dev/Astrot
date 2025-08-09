# Натальная карта (Free + Premium)

Этот модуль реализован на Next.js 14 (App Router) + TypeScript + Tailwind. Все серверные эндпоинты находятся в `app/api/*`.

Если вам нужен Pages Router, создайте аналоги `pages/api/*.ts` на основе кода из `app/api/*` (интерфейсы идентичны). В этом репозитории используется App Router.

## Установка

1) Установите зависимости:

```
npm install
```

Пакеты: `openai`, `geo-tz`, `lru-cache`. Для полноценного Swiss Ephemeris установите `swisseph` (потребуются build tools) и поместите файлы эфемерид.

2) Скопируйте `.env.example` в `.env` и заполните:

```
OPENAI_API_KEY=__PUT_YOUR_KEY__
EPHE_PATH=./ephe
USE_SWE_WASM=false
MOCK_PREMIUM_ALL=false
```

- `OPENAI_API_KEY` — ключ OpenAI (не попадает на клиент, используется только в серверных роутов).
- `EPHE_PATH` — путь к файлам эфемерид Swiss Ephemeris (положите их в `./ephe`).
- `USE_SWE_WASM` — если `true`, включит упрощённый WASM-фоллбек без нативных зависимостей.
- `MOCK_PREMIUM_ALL` — если `true`, подписка всегда активна (для тестов).

3) Файлы эфемерид

Положите файлы эфемерид в папку `./ephe`. Путь задаётся через `EPHE_PATH`.

## Запуск

```
npm run dev
```

Откройте `http://localhost:3000/natal` — интерфейс формы. Корневая страница `/` даёт ссылку на форму.

## API роуты

Все руты — только серверные, ключи не утекут на клиент.

- `POST /api/compute-chart` (Free): базовые расчёты (Swiss Ephemeris либо WASM-фоллбек). Вход: `{ year, month, day, hour, minute, second?, lat, lon, tz?, houseSystem? }`. Выход: `{ jdUt, tz, planets, houses, aspects, summaryText, sunSign }`.
- `POST /api/horoscope` (Premium): обёртка Aztro, кэш 1 час. Вход: `{ sign, day? }`. Выход: объект с `description` и полями дня.
- `POST /api/explain` (Premium): вызывает OpenAI с системной ролью астролога и возвращает структурированный текст в `text`.
- `POST /api/natal-full` (Premium): агрегатор. Проверяет подписку через `/api/subscription/verify`. Если активна — считает карту, подаёт `sunSign` в `/api/horoscope`, затем в `/api/explain`, возвращает `{ chart, daily, explanation }`. Если нет — `{ error: "premium_required" }` со статусом 402.
- `POST /api/subscription/verify`: мок-проверка подписки `{ userId } -> { active }`. Замените позднее на Telegram Stars/Payments.

## Переключение USE_SWE_WASM

- По умолчанию используется нативный `swisseph`, если установлен и доступен. Если библиотека недоступна (node-gyp ошибки), автоматически включается фоллбек `swe-wasm`. Явно можно включить фоллбек установкой переменной `USE_SWE_WASM=true`.

## UI

Компонент формы: `components/NatalForm.tsx`.
- Кнопка «Базовая карта» вызывает `/api/compute-chart` и выводит базовый блок.
- Кнопка «Полный анализ (Premium)» вызывает `/api/natal-full`. Если получен `premium_required`, отображается пейволл-сообщение.
- Выводятся три блока: базовая карта (`summaryText`), дневной гороскоп (Premium), расшифровка ИИ-астролога (Premium).

Страница: `app/natal/page.tsx`.

## Критерии приёмки

- `npm run dev` поднимает проект без ошибок.
- `/api/compute-chart` работает без подписки.
- `/api/natal-full` отказывает без подписки и возвращает результат при активной.
- UI корректно показывает бесплатный и премиум режимы.