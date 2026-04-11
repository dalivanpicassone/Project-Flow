<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=200&section=header&text=Agora&fontSize=80&fontAlignY=35&animation=fadeIn&fontColor=ffffff&desc=Open-Source%20Kanban%20Board&descAlignY=58&descSize=20" width="100%"/>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

</div>

<br/>

**Agora** — open-source Kanban-доска для управления задачами и командной работы. Построена на Next.js и Supabase с поддержкой real-time синхронизации и drag-and-drop.

---

## Возможности

| | |
|---|---|
| **Kanban-доски** | Drag & drop карточек, WIP-лимиты, кастомизация цветов колонок |
| **Карточки** | Приоритеты, дедлайны, чеклисты, комментарии, метки, назначение исполнителей |
| **Командная работа** | Приглашение по ссылке, роли (owner / member), статистика |
| **Real-time** | Живые обновления через Supabase Realtime |
| **Безопасность** | Row Level Security на уровне БД, защищённая аутентификация |

---

## Стек технологий

| Слой | Технологии |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript 5 |
| **UI** | Tailwind CSS 4, shadcn/ui, Lucide Icons |
| **State** | Zustand, Zod |
| **Drag & Drop** | dnd-kit |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) |
| **Tooling** | Biome, Vitest |

---

## Участие в разработке

Agora — открытый проект, и мы рады любому вкладу сообщества.

**Как помочь:**

- Нашли баг? [Откройте issue](../../issues/new?template=bug_report.md)
- Есть идея? [Предложите фичу](../../issues/new?template=feature_request.md)
- Хотите пофиксить что-то сами? Форкните репозиторий и откройте Pull Request

**Рабочий процесс для PR:**

```bash
# 1. Форкните репозиторий и клонируйте свой форк
git clone https://github.com/<your-username>/agora.git
cd agora

# 2. Создайте ветку для своих изменений
git checkout -b feat/your-feature-name

# 3. Установите зависимости
npm install

# 4. Создайте .env.local (см. .env.example)
# и запустите локально
npm run dev

# 5. Сделайте изменения, закоммитьте и откройте PR в main
```

> Пожалуйста, придерживайтесь существующего стиля кода. Проект использует Biome для линтинга и форматирования.

---

## Структура базы данных

Миграции находятся в `supabase/migrations/`. Для локальной разработки последовательно примените их в SQL-редакторе вашего Supabase-проекта.

---

## Лицензия

[MIT](LICENSE) — используйте, изучайте, улучшайте.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=100&section=footer" width="100%"/>
