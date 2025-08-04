# PostMD

Простой сервис для публикации текстов в формате Markdown, аналог rentry.co.

## Возможности

- ✨ Поддержка полного синтаксиса Markdown с живым превью
- 🔗 Кастомные URL для ваших записей
- 🔐 Коды доступа для редактирования и модификации
- 🎨 Подсветка синтаксиса кода
- 💾 Постоянное хранение записей
- 📊 Счетчик просмотров
- ⚡ Быстрая отправка через Ctrl+Enter

## Технологии

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **База данных**: PostgreSQL + Prisma ORM
- **Markdown**: react-mde, react-markdown
- **Деплой**: Vercel

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/postmd.git
cd postmd
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте базу данных:
   - Скопируйте `.env.example` в `.env`
   - Укажите `DATABASE_URL` для вашей PostgreSQL базы данных

4. Выполните миграции:
```bash
npm run prisma:migrate
```

5. Запустите проект:
```bash
npm run dev
```

Приложение будет доступно по адресу http://localhost:3000

## Разработка

Перед коммитом всегда проверяйте код:
```bash
npm run check  # ESLint + TypeScript проверка
npm run build  # Проверка сборки
```

## Деплой на Vercel

1. Создайте проект на [Vercel](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Настройте переменные окружения:
   - `DATABASE_URL` - строка подключения к PostgreSQL (можно использовать Vercel Postgres или Supabase)
4. Разверните проект

## API

### Создание записи
```
POST /api/entries
{
  "content": "# Заголовок\nТекст записи",
  "customUrl": "my-post",      // опционально
  "editCode": "secret123",      // опционально
  "modifyCode": "modify456"     // опционально
}
```

### Получение записи
```
GET /api/entries/{id}
```

### Обновление записи
```
PUT /api/entries/{id}
{
  "content": "Обновленный текст",
  "code": "secret123"  // editCode или modifyCode
}
```

### Удаление записи
```
DELETE /api/entries/{id}?code=secret123
```

## Лицензия

MIT