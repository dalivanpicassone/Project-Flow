<div align="center">

# 🚀 ProjectFlow

**Современный Kanban для управления проектами**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Демо](#демо) • [Возможности](#возможности) • [Установка](#установка) • [Документация](#структура-проекта)

</div>

---

## 📋 Описание

**ProjectFlow** — это полнофункциональное веб-приложение для управления задачами в стиле Kanban. Приложение позволяет создавать доски, колонки и карточки с поддержкой drag-and-drop, совместной работы в реальном времени и гибкой настройки рабочего процесса.

---

## ✨ Возможности

### Управление досками
- 📊 Создание и настройка Kanban-досок
- 🎨 Кастомизация цветов досок
- 📁 Архивирование неактивных досок
- 👥 Приглашение участников по ссылке

### Управление задачами
- ✅ Создание карточек с описанием
- 🔄 Drag-and-drop перемещение между колонками
- 🏷️ Приоритеты задач (critical, high, medium, low)
- 📅 Установка дедлайнов
- 👤 Назначение исполнителей
- 🏷️ Метки и теги

### Колонки и лимиты
- 📋 Неограниченное количество колонок
- ⚠️ WIP-лимиты (Work In Progress)
- 🔢 Автоматическая нумерация позиций
- 🎨 Цветовая маркировка колонок

### Совместная работа
- 🔄 Real-time синхронизация через Supabase Realtime
- 👥 Система ролей (owner, member)
- 🔗 Приглашение по токену
- 📊 Статистика по участникам

### Безопасность
- 🔐 Аутентификация через Supabase Auth
- 🛡️ Row Level Security (RLS) на уровне БД
- 🔒 Защищённые API-маршруты

---

## 🛠️ Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript 5 |
| **Стилизация** | Tailwind CSS 4, Shadcn/UI, Lucide Icons |
| **State Management** | Zustand |
| **Drag & Drop** | DnD Kit |
| **Формы** | React Hook Form, Zod |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **Тестирование** | Vitest, Testing Library |
| **Линтинг** | Biome |
| **Деплой** | Vercel |

---

## 📦 Установка

### Предварительные требования

- Node.js 20+
- npm / yarn / pnpm
- Аккаунт [Supabase](https://supabase.com/)

### Клонирование репозитория

```bash
git clone https://github.com/your-username/projectflow.git
cd projectflow
```

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Приложение
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Настройка базы данных

1. Создайте новый проект в [Supabase](https://app.supabase.com/)
2. Выполните миграции из папки `supabase/migrations/` в SQL-редакторе Supabase:
   - `001_initial_schema.sql` — базовая схема
   - `002_fix_board_members_select_policy.sql` — исправления RLS
   - `003_fix_recursive_rls_policies.sql` — исправления рекурсивных политик
   - `004_fix_rls_with_check.sql` — дополнительные политики

---

## 🚀 Запуск

### Режим разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для продакшена

```bash
npm run build
npm start
```

---

## 📁 Структура проекта

```
projectflow/
├── public/                 # Статические файлы
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Страницы авторизации
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/    # Защищённые страницы
│   │   │   └── dashboard/
│   │   ├── api/            # API-маршруты
│   │   │   └── board/
│   │   ├── board/          # Страницы досок
│   │   │   └── [id]/
│   │   ├── invite/         # Приглашения
│   │   └── profile/        # Профиль пользователя
│   │
│   ├── components/         # React-компоненты
│   │   ├── auth/           # Формы авторизации
│   │   ├── board/          # Компоненты досок
│   │   ├── dashboard/      # Компоненты дашборда
│   │   ├── kanban/         # Kanban-компоненты
│   │   ├── layout/         # Лейаут-компоненты
│   │   └── ui/             # UI-библиотека (Shadcn)
│   │
│   ├── hooks/              # React-хуки
│   │   ├── useAuth.ts
│   │   ├── useBoards.ts
│   │   ├── useCards.ts
│   │   ├── useColumns.ts
│   │   └── useRealtime.ts
│   │
│   ├── lib/                # Утилиты и конфиги
│   │   ├── supabase/       # Клиенты Supabase
│   │   └── validations/    # Zod-схемы
│   │
│   ├── store/              # Zustand-сторы
│   │   ├── boardStore.ts
│   │   ├── cardStore.ts
│   │   └── columnStore.ts
│   │
│   ├── test/               # Тестовые утилиты
│   └── types/              # TypeScript-типы
│
├── supabase/
│   └── migrations/         # SQL-миграции
│
├── biome.json              # Конфиг Biome
├── next.config.ts          # Конфиг Next.js
├── tailwind.config.ts      # Конфиг Tailwind
├── tsconfig.json           # Конфиг TypeScript
└── vitest.config.ts        # Конфиг Vitest
```

---

## 📜 Доступные скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run start` | Запуск production-сервера |
| `npm run lint` | Проверка кода через Biome |
| `npm run lint:fix` | Автоисправление lint-ошибок |
| `npm run format` | Форматирование кода |
| `npm run check` | Полная проверка и форматирование |
| `npm run test` | Запуск тестов |
| `npm run test:ui` | Тесты с UI-интерфейсом |

---

## 🧪 Тестирование

Проект использует **Vitest** и **Testing Library** для тестирования.

```bash
# Запуск всех тестов
npm run test

# Тесты в watch-режиме
npm run test -- --watch

# Тесты с UI
npm run test:ui

# Coverage
npm run test -- --coverage
```

---

## 🚢 Деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к [Vercel](https://vercel.com/)
2. Добавьте переменные окружения в настройках проекта
3. Деплой произойдёт автоматически при пуше в main

```bash
# Ручной деплой
npx vercel --prod
```

### Другие платформы

Приложение можно развернуть на любой платформе с поддержкой Node.js:

- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

---

## 🤝 Участие в разработке

Мы приветствуем вклад в проект! Для участия:

1. Форкните репозиторий
2. Создайте ветку для фичи: `git checkout -b feature/amazing-feature`
3. Закоммитьте изменения: `git commit -m 'feat: add amazing feature'`
4. Запушьте ветку: `git push origin feature/amazing-feature`
5. Откройте Pull Request

### Правила коммитов

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — новая функциональность
- `fix:` — исправление бага
- `docs:` — изменения документации
- `style:` — форматирование кода
- `refactor:` — рефакторинг
- `test:` — добавление тестов
- `chore:` — прочие изменения

---

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

---

## 📞 Контакты

Если у вас есть вопросы или предложения, создайте [Issue](https://github.com/your-username/projectflow/issues) или свяжитесь с нами.

---

<div align="center">

**Сделано с ❤️ с использованием Next.js и Supabase**

</div>
