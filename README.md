<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=200&section=header&text=ProjectFlow&fontSize=70&fontAlignY=35&animation=fadeIn&fontColor=ffffff&desc=Kanban%20Board%20for%20Modern%20Teams&descAlignY=58&descSize=20" width="100%"/>

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=6366F1&center=true&vCenter=true&random=false&width=600&lines=Real-time+Kanban+boards;Drag+%26+drop+task+management;Team+collaboration+made+easy;Built+with+Next.js+%26+Supabase" alt="Typing SVG" /></a>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge)](LICENSE)

</div>


<br/>

<div align="center">

**ProjectFlow** — веб-приложение для управления задачами в стиле Kanban с поддержкой real-time синхронизации, drag-and-drop и совместной работой команды.

</div>

<br/>

---

## ✨ Возможности

<table>
<tr>
<td width="50%">

**📋 Kanban-доски**
- Drag & drop карточек между колонками
- WIP-лимиты на колонки
- Кастомизация цветов

</td>
<td width="50%">

**🃏 Умные карточки**
- Приоритеты (critical / high / medium / low)
- Дедлайны и назначение исполнителей
- Метки и теги

</td>
</tr>
<tr>
<td width="50%">

**👥 Командная работа**
- Приглашение участников по ссылке
- Роли: owner и member
- Статистика по участникам

</td>
<td width="50%">

**⚡ Real-time & Безопасность**
- Live-обновления через Supabase Realtime
- Row Level Security на уровне БД
- Защищённая аутентификация

</td>
</tr>
</table>

---

## 🛠️ Стек технологий

<div align="center">

| | |
|---|---|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **UI** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=flat-square&logo=shadcnui) ![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square) |
| **State** | ![Zustand](https://img.shields.io/badge/Zustand-433D3D?style=flat-square) ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) |
| **DnD** | ![dnd-kit](https://img.shields.io/badge/dnd--kit-FF4154?style=flat-square) |
| **Backend** | ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) |
| **Testing** | ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat-square&logo=testinglibrary&logoColor=white) |
| **Tooling** | ![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat-square&logo=biome&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel) |

</div>

---

## 🚀 Быстрый старт

**1. Клонируй репозиторий**
```bash
git clone https://github.com/your-username/projectflow.git
cd projectflow
npm install
```

**2. Создай `.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**3. Примени миграции базы данных**

В SQL-редакторе [Supabase](https://app.supabase.com/) последовательно выполни файлы из папки `supabase/migrations/`.

**4. Запусти**
```bash
npm run dev  # http://localhost:3000
```

---

## 📄 Лицензия

[MIT](LICENSE)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=100&section=footer" width="100%"/>
