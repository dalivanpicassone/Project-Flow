<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=220&section=header&text=Agora&fontSize=90&fontAlignY=38&animation=fadeIn&fontColor=ffffff&desc=Kanban-доска%20с%20открытым%20исходным%20кодом&descAlignY=60&descSize=22" width="100%"/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1000&color=6366F1&center=true&vCenter=true&random=false&width=600&lines=Real-time+Kanban-доски;Drag+%26+drop+управление+задачами;Чеклисты+и+комментарии+к+карточкам;Командная+работа+в+реальном+времени;Next.js+%2B+Supabase" alt="Typing SVG" />
</a>

<br/><br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge&logo=github)](../../pulls)

<br/>

**Agora** — open-source приложение для управления задачами в стиле Kanban с поддержкой real-time синхронизации, drag-and-drop, чеклистами, комментариями и ролевым доступом.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-project--flow--beige.vercel.app-6366F1?style=for-the-badge)](https://project-flow-beige.vercel.app/)
[![Сообщить об ошибке](https://img.shields.io/badge/🐛_Сообщить_об_ошибке-Issues-red?style=for-the-badge)](../../issues/new?template=bug_report.md)
[![Предложить идею](https://img.shields.io/badge/💡_Предложить_идею-Issues-orange?style=for-the-badge)](../../issues/new?template=feature_request.md)

</div>

---

## ✨ Возможности

<table>
<tr>
<td width="50%" valign="top">

### 📋 Kanban-доски
- Drag & drop карточек между колонками
- WIP-лимиты на колонки
- Кастомизация цветов колонок
- Несколько досок в одном воркспейсе

</td>
<td width="50%" valign="top">

### 🃏 Умные карточки
- Приоритеты: `critical` · `high` · `medium` · `low`
- Дедлайны и назначение исполнителей
- Чеклисты с отслеживанием прогресса
- Комментарии и лента активности
- Метки и теги

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 👥 Командная работа
- Приглашение по ссылке
- Роли: **owner** и **member**
- Управление участниками по досками
- Статистика активности

</td>
<td width="50%" valign="top">

### ⚡ Real-time & Безопасность
- Live-обновления через Supabase Realtime
- Row Level Security на уровне БД
- Защищённая аутентификация (email + OAuth)
- Фильтрация карточек по исполнителю, приоритету, метке

</td>
</tr>
</table>

---

## 🛠️ Стек технологий

<div align="center">

| Слой | Технологии |
|---|---|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **UI** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=flat-square&logo=shadcnui) ![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square) |
| **State** | ![Zustand](https://img.shields.io/badge/Zustand-433D3D?style=flat-square) ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) |
| **Drag & Drop** | ![dnd-kit](https://img.shields.io/badge/dnd--kit-FF4154?style=flat-square) |
| **Backend** | ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) |
| **Тестирование** | ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat-square&logo=testinglibrary&logoColor=white) |
| **Инструменты** | ![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat-square&logo=biome&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel) |

</div>

---

## 🚀 Быстрый старт

**1. Форкни и клонируй репозиторий**
```bash
git clone https://github.com/<твой-username>/agora.git
cd agora
npm install
```

**2. Создай `.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**3. Примени миграции базы данных**

Последовательно выполни файлы из папки `supabase/migrations/` в SQL-редакторе [Supabase](https://app.supabase.com/).

**4. Запусти сервер разработки**
```bash
npm run dev   # → http://localhost:3000
```

---

## 🤝 Участие в разработке

Любой вклад в проект приветствуется и очень ценится.

1. Форкни репозиторий
2. Создай ветку: `git checkout -b feat/крутая-фича`
3. Закоммить изменения: `git commit -m 'feat: добавить крутую фичу'`
4. Запушь ветку: `git push origin feat/крутая-фича`
5. Открой Pull Request

> Проект использует [Biome](https://biomejs.dev/) для линтинга и форматирования. Убедись, что код проходит `npm run lint` перед отправкой PR.

Смотри [открытые issues](../../issues) — там есть идеи для работы.

---

## 🌍 Языки

- [🇬🇧 English](README.md)

---

## 📄 Лицензия

Распространяется под лицензией MIT. Подробности в файле [`LICENSE`](LICENSE).

<br/>

<div align="center">

Сделано с ❤️ и открыто для сообщества

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=120&section=footer" width="100%"/>

</div>
