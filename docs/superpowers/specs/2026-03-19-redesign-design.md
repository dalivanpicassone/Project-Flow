# ProjectFlow — Redesign Spec
Date: 2026-03-19

## Summary

Full visual redesign of ProjectFlow (Next.js Kanban app). Replace the current inconsistent light/dark hybrid with a cohesive dark-mode-first interface featuring an icon sidebar, indigo accent, and minimalist column styling.

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Theme | Dark | App is a productivity tool; dark reduces visual fatigue |
| Navigation | Icon sidebar (52px) | Always accessible, scales if new sections added |
| Accent color | Indigo `#6366f1` | Calm, technical, like Linear/Notion |
| Column style | 3px top border + left card border | Elegant, content-focused, less visual noise than full colored headers |
| Active column | Indigo ring + indigo-tinted header text | Drag-over state only (`isOver` from useDroppable) |
| Done cards | No automatic opacity change | Avoids false positives; card opacity stays 1 |

---

## Color Tokens (globals.css dark mode)

```
background:       #0d0d14   (main canvas — body bg)
sidebar bg:       #0a0a12   (slightly deeper than main)
card bg:          #111118   (panels, board cards, kanban columns)
card inner bg:    #16161e   (kanban cards inside columns)
border-subtle:    #141420   (sidebar right border, topbar bottom border, column header separator)
border:           #1a1a24   (default card/panel borders)
border-inner:     #1e1e2a   (inner kanban card borders)
border-active:    #6366f130 (indigo-tinted border for drag-over column)
border-hover:     #252535   (card/board-card hover border)

primary:          #6366f1   (indigo — buttons, active nav, accent)
primary-hover:    #4f52d4

text-primary:     #f1f5f9
text-secondary:   #9ca3af
text-muted:       #4b5563
text-disabled:    #374151
```

All values are used as Tailwind arbitrary values (e.g. `border-[#1a1a24]`). `#141420` is intentionally deeper than `#1a1a24` — used only for structural dividers.

---

## Layout

```
┌──────────────────────────────────────────────┐
│  Sidebar (52px fixed)  │  Main (flex-1)       │
│                        │  ┌────────────────┐  │
│  [Logo]                │  │ Topbar (48px)  │  │
│  ────                  │  └────────────────┘  │
│  [Grid icon] ← active  │  │ Page content   │  │
│  [Kanban icon]         │  │ (scrollable)   │  │
│  [Settings icon]       │  │                │  │
│                        │  │                │  │
│  ────                  │  │                │  │
│  [User avatar]         │  └────────────────┘  │
└──────────────────────────────────────────────┘
```

### layout.tsx structure

`src/app/(dashboard)/layout.tsx` becomes:

```tsx
<div className="flex min-h-screen bg-[#0d0d14]">
  <Sidebar />
  <div className="flex flex-col flex-1 min-w-0">
    {children}   {/* each page renders its own Topbar + content */}
  </div>
</div>
```

Remove the existing `max-w-7xl mx-auto px-4 py-8` `<main>` wrapper — each page manages its own padding. Remove the `<Header />` import entirely.

### Sidebar component (src/components/layout/Sidebar.tsx)

Overwrite the existing stub completely. Implementation:

```
- "use client"
- width: w-[52px], flex-shrink-0, bg-[#0a0a12], border-r border-[#141420]
- flex flex-col items-center, py-3, gap-1.5, min-h-screen

Logo block (top):
  - 32×32, bg-[#6366f1], rounded-lg, letter "P", font-bold text-white text-sm
  - margin-bottom: mb-3
  - Link href="/dashboard"

Divider: w-6 h-px bg-[#1a1a24] my-1

Nav items (icons only, no labels):
  - LayoutGrid  → href="/dashboard"  (title="Мои доски")
  - No Settings icon in this redesign — out of scope
  - Each item: 36×36, rounded-lg, flex items-center justify-center
  - Default: text-[#4b5563], hover: bg-[#16161e] text-[#9ca3af]
  - Active (usePathname match): use inline style `background: '#6366f115'` (not Tailwind arbitrary bg — alpha hex not supported),
    color: text-[#818cf8], plus 3px left indicator bar via absolute-positioned child div:
    `<div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-[#6366f1] rounded-r" />`
    (parent must be `relative`)

Bottom block (margin-top: auto):
  - User avatar: 28×28 rounded-full bg-[#1e1e2a] border border-[#2a2a3a]
  - Shows initials (first letter of email or full name), text-[#818cf8] text-xs font-semibold
  - Wrap in DropdownMenu (shadcn); trigger = the avatar div
  - Menu items: "Профиль" (Link to /profile) and "Выйти" (calls `signOut` from `useAuth()`)
  - `useAuth()` returns `{ user, isLoading, signOut }` — `signOut` is an async function, no args
```

Active route detection: `usePathname()` from `next/navigation`. Dashboard icon active when pathname starts with `/dashboard`. No other nav items are active-highlighted in this redesign.

### Topbar

The Topbar is **not a shared component** — each page renders its own topbar inline at the top of its content. This matches the existing pattern (Header was global, but topbar content is page-specific).

- Dashboard page: `h-12 border-b border-[#141420] px-5 flex items-center` — title left, "Новая доска" button right
- Board page (`src/app/board/[id]/page.tsx`): same height — breadcrumb left, "Пригласить" + "Настройки" buttons right

Primary button: `bg-[#6366f1] hover:bg-[#4f52d4] text-white text-xs font-semibold h-[30px] px-3.5 rounded-lg`

Secondary button: `bg-[#16161e] border border-[#1e1e2a] text-[#9ca3af] text-xs h-[30px] px-3 rounded-lg`

---

## Dashboard Page

### Stats Grid (`DashboardStats.tsx`)

- Grid: `grid grid-cols-2 lg:grid-cols-4 gap-3` (keep existing gap-3, not gap-10)
- Each stat card: `bg-[#111118] border border-[#1a1a24] rounded-xl p-4`
- Icon container: 28×28 `rounded-lg` with color-specific bg at ~10% opacity (keep existing iconBg/iconColor classes — they already use Tailwind color utilities like `bg-blue-500/10 text-blue-400` which work fine)
- Value: `text-2xl font-bold` (keep existing `font-bold`, do not change to `font-extrabold`)
- Hint: `text-xs text-muted-foreground` (keep as-is)
- Only change: replace the outer div's Tailwind classes. Current: `rounded-xl border border-border bg-card p-4`. New: `rounded-xl border border-[#1a1a24] bg-[#111118] p-4`. No other changes needed in this component.

### Board Cards Grid (`BoardList.tsx` + `BoardCard.tsx`)

`BoardList.tsx`:
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3`

`BoardCard.tsx`:
- Outer: `bg-[#111118] border border-[#1a1a24] rounded-xl overflow-hidden transition-all duration-200`
- Hover: `hover:border-[#252535] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-px`
- Top accent bar: 3px `div`, `style={{ backgroundColor: accentColor }}`
- Board icon: 28×28 `rounded-lg`, `style={{ backgroundColor: accentColor + '22' }}`, letter initial colored with `accentColor`
- Title: `text-sm font-semibold text-[#e2e8f0]`
- Description: `text-xs text-[#4b5563] line-clamp-2`
- Footer: `border-t border-[#141420]`, `text-xs text-[#374151]`
- Hover gradient overlay: keep existing `radial-gradient` pattern

---

## Kanban Board Page

### Column (`KanbanColumn.tsx`)

- Width: `w-60` (240px, was `w-72`)
- Outer: `flex flex-col bg-[#111118] rounded-xl border border-[#1a1a24]`
- Drag-over state (`isOver`): use inline style — `style={{ borderColor: '#6366f150', boxShadow: '0 0 0 1px #6366f120' }}`. Do NOT use Tailwind arbitrary `border-[#6366f130]` — 8-digit hex alpha is not supported by Tailwind's JIT.
- Top bar: `<div className="h-[3px] w-full rounded-t-xl" style={{ backgroundColor: colColor }} />`
  where `colColor = column.color ?? '#6b7280'`
- Column header: `px-3 py-2.5 border-b border-[#141420] flex items-center gap-2`
  - Title: `text-xs font-semibold` colored with `colColor`
  - Count badge: `text-[10px] px-1.5 py-0.5 rounded-full` with `backgroundColor: colColor + '20'`, `color: colColor`
  - MoreHorizontal menu button: `text-[#374151] hover:text-[#9ca3af]`
- Cards drop zone: `flex flex-col gap-2 p-2 flex-1 min-h-[4rem]`
- Add card button at bottom: dashed border button, indigo on hover

### Cards (`KanbanCard.tsx`)

- Outer wrapper: keep sortable div
- Card button: `w-full text-left rounded-lg bg-[#16161e] border border-[#1e1e2a] p-3 space-y-2`
  - Left border: `border-l-2` with `style={{ borderLeftColor: colColor }}`
  - Must receive `colColor` as a prop from `KanbanColumn`
- Hover: `hover:border-[#252535] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]`
- Title: `text-sm font-medium text-[#e2e8f0]`
- Card opacity: always 1 (no done-state dimming)

**Prop change:** `KanbanCard` gains `colColor: string` prop. `KanbanColumn` derives `colColor = column.color ?? '#6b7280'` internally (from the already-available `column` object) and passes `colColor={colColor}` to each `<KanbanCard>`. No new props are added to `KanbanColumn` or `KanbanBoard`.

### KanbanBoard (`KanbanBoard.tsx`)

No changes needed — `column` is already passed to `KanbanColumn`, which derives `colColor` itself.

Note on drag ghost opacity: `KanbanCard` currently applies `opacity: isDragging ? 0.35 : 1` for the drag source ghost. Keep this — it is UX feedback for dragging, unrelated to done-state dimming which is not implemented.

---

## Files to Change

### Core layout

- `src/app/(dashboard)/layout.tsx` — new flex-row shell, remove `<Header />` + `max-w-7xl` wrapper, add `<Sidebar />`
- `src/app/layout.tsx` — ensure `<html className="dark">` so dark CSS vars apply
- `src/app/globals.css` — update the following CSS variables in the `.dark` block:
  - `--background: oklch(0.09 0.005 260)` → `oklch(0.07 0.008 265)` (approximates `#0d0d14`)
  - `--card: oklch(0.13 0.005 260)` → `oklch(0.10 0.006 265)` (approximates `#111118`)
  - `--border: oklch(1 0 0 / 7%)` → `oklch(1 0 0 / 10%)` (approximates `#1a1a24`)
  - These changes ensure shadcn components (Alert, Dialog, etc.) that use CSS vars also match. All direct Tailwind arbitrary values in the redesigned components take priority and don't depend on these vars.
- `src/components/layout/Sidebar.tsx` — overwrite with new sidebar per spec above
- `src/components/layout/Header.tsx` — remove from layout; delete file after confirming no remaining imports

### Dashboard

- `src/app/(dashboard)/dashboard/page.tsx` — add inline topbar (h-12 bar with title + button), wrap remaining content in scrollable `div` with padding
- `src/components/dashboard/DashboardStats.tsx` — update card bg/border tokens if needed (icons/colors already good)
- `src/components/board/BoardCard.tsx` — update border, hover, footer border to new tokens
- `src/components/board/BoardList.tsx` — update grid to 3 cols

### Kanban

- `src/components/kanban/KanbanColumn.tsx` — width w-60, new top bar, new header styling, updated drop-zone style
- `src/components/kanban/KanbanCard.tsx` — add `colColor` prop, left border accent, updated bg/border tokens
- `src/app/board/[id]/page.tsx` — add inline topbar (breadcrumb + action buttons)
- `src/app/board/layout.tsx` — **create new file** with the same flex shell as `(dashboard)/layout.tsx`: `<div className="flex min-h-screen bg-[#0d0d14]"><Sidebar /><div className="flex flex-col flex-1 min-w-0">{children}</div></div>`. This is needed because `src/app/board/` is outside the `(dashboard)` route group and does not inherit its layout.

Note: `DashboardStats.tsx` at `src/components/dashboard/DashboardStats.tsx` already exists on disk (untracked in git). Edit it, do not create it.

---

## Out of Scope

- No new features
- No data model changes
- No auth flow changes
- Login/register pages: not redesigned in this spec
- Board settings page: not redesigned in this spec
