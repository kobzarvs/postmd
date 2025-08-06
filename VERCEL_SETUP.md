# Настройка переменных окружения в Vercel

## Обязательные переменные

Эти переменные **обязательны** для работы приложения:

### 1. `DATABASE_URL`
- **Описание**: URL подключения к базе данных PostgreSQL (Neon)
- **Формат**: `postgresql://user:password@host/database?sslmode=require`
- **Где взять**: 
  - Создайте проект на [Neon](https://neon.tech)
  - Скопируйте connection string из панели управления
  - **Важно**: Используйте pooled connection для serverless

### 2. `NEXTAUTH_SECRET`
- **Описание**: Секретный ключ для подписи JWT токенов
- **Как сгенерировать**: 
  ```bash
  openssl rand -base64 32
  ```
- **Пример**: `k3Jk8Lw9mN2oP5qR7sT1uV4wX6yZ8aB0cD2eF4gH6`

### 3. `NEXTAUTH_URL`
- **Описание**: Публичный URL вашего приложения
- **Для продакшена**: `https://ваш-домен.vercel.app`
- **Важно**: Без слеша в конце!

## Опциональные переменные (OAuth провайдеры)

Приложение будет работать без OAuth провайдеров. Добавляйте только те, которые хотите использовать:

### GitHub OAuth (опционально)
- `OAUTH_GITHUB_ID` - Client ID от GitHub OAuth App
- `OAUTH_GITHUB_SECRET` - Client Secret от GitHub OAuth App
- **Настройка**:
  1. Перейдите на https://github.com/settings/developers
  2. Создайте новое OAuth App
  3. Homepage URL: `https://ваш-домен.vercel.app`
  4. Authorization callback URL: `https://ваш-домен.vercel.app/api/auth/callback/github`

### Google OAuth (опционально)
- `OAUTH_GOOGLE_ID` - Client ID от Google OAuth
- `OAUTH_GOOGLE_SECRET` - Client Secret от Google OAuth
- **Настройка**:
  1. Перейдите на https://console.cloud.google.com/
  2. Создайте новый проект или выберите существующий
  3. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
  4. Authorized redirect URIs: `https://ваш-домен.vercel.app/api/auth/callback/google`

### Twitter OAuth (опционально)
- `OAUTH_TWITTER_ID` - Client ID от Twitter OAuth 2.0
- `OAUTH_TWITTER_SECRET` - Client Secret от Twitter OAuth 2.0
- **Настройка**:
  1. Перейдите на https://developer.twitter.com/
  2. Создайте новое приложение
  3. Callback URL: `https://ваш-домен.vercel.app/api/auth/callback/twitter`

## Как добавить переменные в Vercel

1. Откройте проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в Settings → Environment Variables
3. Добавьте каждую переменную:
   - Name: название переменной (например, `DATABASE_URL`)
   - Value: значение переменной
   - Environment: выберите Production, Preview и Development
4. Нажмите Save

## Проверка настройки

После добавления переменных:
1. Сделайте новый деплой (Deployments → Redeploy)
2. Проверьте логи в Function Logs если есть ошибки
3. Убедитесь что `/api/auth/session` возвращает статус 200

## Важные замечания

- **Без OAuth провайдеров**: Приложение будет работать в режиме только анонимных записей
- **С OAuth провайдерами**: Пользователи смогут авторизоваться и привязывать записи к аккаунту
- **NEXTAUTH_SECRET**: Должен быть одинаковым для всех окружений (production, preview)
- **DATABASE_URL**: Используйте отдельные базы данных для production и development

## Troubleshooting

### Ошибка 500 на `/api/auth/session`
- Проверьте что `NEXTAUTH_SECRET` установлен
- Проверьте что `NEXTAUTH_URL` соответствует вашему домену
- Проверьте логи в Vercel → Functions

### OAuth провайдер не работает
- Убедитесь что callback URL правильный
- Проверьте что переменные окружения установлены для Production
- Проверьте что приложение OAuth активировано у провайдера

### База данных не подключается
- Используйте pooled connection string из Neon
- Проверьте что база данных не спит (Neon free tier)
- Убедитесь что миграции применены: `npx prisma migrate deploy`