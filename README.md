<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=220&section=header&text=Agora&fontSize=90&fontAlignY=38&animation=fadeIn&fontColor=ffffff&desc=Open-Source%20Kanban%20Board%20for%20Modern%20Teams&descAlignY=60&descSize=22" width="100%"/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1000&color=6366F1&center=true&vCenter=true&random=false&width=600&lines=Real-time+Kanban+boards;Drag+%26+drop+task+management;Checklists+%26+comments+on+cards;Team+collaboration+made+easy;Built+with+Next.js+%26+Supabase" alt="Typing SVG" />
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

**Agora** is an open-source Kanban board application for task management and team collaboration — with real-time sync, drag-and-drop, checklists, comments, and role-based access.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-project--flow--beige.vercel.app-6366F1?style=for-the-badge)](https://project-flow-beige.vercel.app/)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-Issues-red?style=for-the-badge)](../../issues/new?template=bug_report.md)
[![Request Feature](https://img.shields.io/badge/💡_Request_Feature-Issues-orange?style=for-the-badge)](../../issues/new?template=feature_request.md)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 📋 Kanban Boards
- Drag & drop cards between columns
- WIP limits per column
- Custom column colors
- Multiple boards per workspace

</td>
<td width="50%" valign="top">

### 🃏 Smart Cards
- Priority levels: `critical` · `high` · `medium` · `low`
- Deadlines & assignees
- Checklists with progress tracking
- Comments & activity feed
- Labels & tags

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 👥 Team Collaboration
- Invite members via shareable link
- Roles: **owner** and **member**
- Per-board member management
- Activity statistics

</td>
<td width="50%" valign="top">

### ⚡ Real-time & Security
- Live updates via Supabase Realtime
- Row Level Security at database level
- Secure authentication (email + OAuth)
- Filter cards by assignee, priority, label

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|---|---|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **UI** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=flat-square&logo=shadcnui) ![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square) |
| **State** | ![Zustand](https://img.shields.io/badge/Zustand-433D3D?style=flat-square) ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) |
| **Drag & Drop** | ![dnd-kit](https://img.shields.io/badge/dnd--kit-FF4154?style=flat-square) |
| **Backend** | ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) |
| **Testing** | ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat-square&logo=testinglibrary&logoColor=white) |
| **Tooling** | ![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat-square&logo=biome&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel) |

</div>

---

## 🚀 Quick Start

**1. Fork & clone the repository**
```bash
git clone https://github.com/<your-username>/agora.git
cd agora
npm install
```

**2. Create `.env.local`**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**3. Apply database migrations**

Run files from `supabase/migrations/` sequentially in your [Supabase](https://app.supabase.com/) SQL editor.

**4. Start the dev server**
```bash
npm run dev   # → http://localhost:3000
```

---

## 🤝 Contributing

Contributions are what make open source amazing. Any contribution you make is **greatly appreciated**.

1. Fork the repository
2. Create your branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

> The project uses [Biome](https://biomejs.dev/) for linting and formatting. Please make sure your code passes `npm run lint` before submitting a PR.

See [open issues](../../issues) for ideas on what to work on.

---

## 🌍 Translations

- [🇷🇺 Русский](README.ru.md)

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

<br/>

<div align="center">

Made with ❤️ and open to the community

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=120&section=footer" width="100%"/>

</div>
