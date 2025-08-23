# Настройка Supabase для DeepSoul

## 📋 Шаги по настройке

### 1. Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com) и создайте аккаунт
2. Создайте новый проект:
   - Название: `deepsoul` (или любое другое)
   - Пароль базы данных: сохраните в надежном месте
   - Регион: выберите ближайший к вашим пользователям

### 2. Получение ключей доступа

После создания проекта перейдите в **Settings → API** и скопируйте:

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` ключ → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` ключ → `SUPABASE_SERVICE_ROLE_KEY`

В **Settings → Database** скопируйте:
- `Connection string` (Transaction mode) → `DATABASE_URL`
- `Connection string` (Session mode) → `DIRECT_URL`

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Supabase Database URLs
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# OpenAI (если используется)
OPENAI_API_KEY="your_openai_key"

# Vercel KV (опционально)
KV_URL=""
KV_REST_API_URL=""
KV_REST_API_TOKEN=""
```

### 4. Создание таблиц в базе данных

Выполните миграцию Prisma:

```bash
# Генерация SQL из схемы Prisma
npx prisma migrate dev --name init

# Или если база уже существует
npx prisma db push

# Генерация клиента Prisma
npx prisma generate
```

### 5. Настройка Row Level Security (RLS)

В Supabase Dashboard перейдите в **SQL Editor** и выполните:

```sql
-- Включаем RLS для всех таблиц
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NatalChart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Interpretation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Horoscope" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatThread" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatMessage" ENABLE ROW LEVEL SECURITY;

-- Политики для User
CREATE POLICY "Users can view own data" ON "User"
  FOR SELECT USING (auth.uid()::text = id OR auth.uid()::text = tgId);

CREATE POLICY "Users can update own data" ON "User"
  FOR UPDATE USING (auth.uid()::text = id OR auth.uid()::text = tgId);

-- Политики для Profile
CREATE POLICY "Users can view own profile" ON "Profile"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = "Profile"."userId" 
      AND (auth.uid()::text = "User".id OR auth.uid()::text = "User"."tgId")
    )
  );

CREATE POLICY "Users can update own profile" ON "Profile"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = "Profile"."userId" 
      AND (auth.uid()::text = "User".id OR auth.uid()::text = "User"."tgId")
    )
  );

-- Аналогично для остальных таблиц...
```

### 6. Проверка подключения

Запустите приложение в режиме разработки:

```bash
npm run dev
```

Проверьте консоль браузера и терминал на наличие ошибок подключения к БД.

## 🔄 Миграция существующих данных

При первом входе пользователя после обновления автоматически запустится миграция данных из localStorage в Supabase.

Миграция включает:
- ✅ Профили пользователей
- ✅ Натальные карты
- ✅ Настройки и предпочтения

## 📊 Мониторинг

В Supabase Dashboard вы можете:
- Просматривать данные в таблицах (Table Editor)
- Отслеживать запросы (Database → Query Performance)
- Мониторить использование (Reports)
- Настраивать бэкапы (Settings → Backups)

## 🚀 Деплой на Vercel

При деплое на Vercel добавьте те же переменные окружения в настройках проекта:

1. Перейдите в настройки проекта на Vercel
2. Settings → Environment Variables
3. Добавьте все переменные из `.env.local`
4. Передеплойте проект

## 🔒 Безопасность

1. **Никогда** не коммитьте `.env.local` в git
2. Используйте `service_role` ключ только на сервере
3. Регулярно ротируйте ключи API
4. Настройте RLS политики для всех таблиц
5. Включите 2FA для аккаунта Supabase

## 📝 Полезные команды

```bash
# Просмотр схемы БД
npx prisma studio

# Сброс БД (осторожно!)
npx prisma migrate reset

# Обновление Prisma Client
npx prisma generate

# Валидация схемы
npx prisma validate
```

## 🆘 Решение проблем

### Ошибка подключения к БД
- Проверьте правильность DATABASE_URL
- Убедитесь, что IP не заблокирован в Supabase

### Ошибки миграции
- Проверьте версии Prisma и @prisma/client
- Убедитесь, что схема синхронизирована: `npx prisma db push`

### Проблемы с правами доступа
- Проверьте RLS политики
- Используйте service_role ключ для административных операций

## 📚 Дополнительные ресурсы

- [Документация Supabase](https://supabase.com/docs)
- [Документация Prisma](https://www.prisma.io/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)