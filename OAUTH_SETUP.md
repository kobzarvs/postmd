# Настройка OAuth Провайдеров

Для полной функциональности авторизации необходимо настроить OAuth приложения у провайдеров.

## 🔧 Требуемые переменные окружения

Добавьте в ваш `.env` файл:

```bash
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-random-secret-key-here"

# GitHub OAuth (префикс OAUTH_ чтобы избежать конфликта с GitHub Actions)
OAUTH_GITHUB_ID="your-github-oauth-app-id"
OAUTH_GITHUB_SECRET="your-github-oauth-app-secret"

# Google OAuth  
OAUTH_GOOGLE_ID="your-google-oauth-client-id"
OAUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Twitter OAuth
OAUTH_TWITTER_ID="your-twitter-oauth-client-id" 
OAUTH_TWITTER_SECRET="your-twitter-oauth-client-secret"
```

## 🐙 GitHub OAuth Setup

1. Перейдите в [GitHub Developer Settings](https://github.com/settings/developers)
2. Нажмите **"New OAuth App"**
3. Заполните данные:
   - **Application name**: PostMD
   - **Homepage URL**: `https://your-domain.vercel.app`
   - **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`
4. Скопируйте **Client ID** и **Client Secret**

## 🔍 Google OAuth Setup

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите **Google+ API**
4. Перейдите в **APIs & Services** → **Credentials**
5. Нажмите **"Create Credentials"** → **"OAuth client ID"**
6. Выберите **"Web application"**
7. Добавьте redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`
8. Скопируйте **Client ID** и **Client Secret**

## 🐦 Twitter OAuth Setup

1. Перейдите в [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Создайте новое приложение
3. В настройках приложения:
   - **App permissions**: Read
   - **Type of App**: Web App
   - **Callback URLs**: `https://your-domain.vercel.app/api/auth/callback/twitter`
   - **Website URL**: `https://your-domain.vercel.app`
4. Скопируйте **API Key** и **API Secret Key**

## 🔐 NEXTAUTH_SECRET

Сгенерируйте случайную строку:

```bash
openssl rand -base64 32
```

Или используйте онлайн генератор: https://generate-secret.vercel.app/32

## 🚀 Настройка в Vercel

1. Откройте ваш проект в Vercel Dashboard
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте все переменные окружения
4. Перезапустите деплой

## ✅ Проверка работы

После настройки:
1. Откройте ваш сайт
2. Нажмите **"Войти"** в правом верхнем углу  
3. Выберите провайдера для входа
4. Авторизуйтесь и создайте запись
5. Записи будут автоматически привязаны к вашему аккаунту

## 🎯 Преимущества авторизации

- ✅ Записи привязываются к вашему аккаунту
- ✅ Редактирование своих записей без кодов доступа
- ✅ Страница профиля с управлением записями
- ✅ Статистика ваших записей и просмотров