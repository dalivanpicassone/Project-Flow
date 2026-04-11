-- 006_card_checklists.sql
-- Adds checklists (with items) to kanban cards, with RLS.

-- ── Tables ───────────────────────────────────────────────────────────────────
create table if not exists card_checklists (
  id         uuid        primary key default gen_random_uuid(),
  card_id    uuid        not null references cards(id) on delete cascade,
  title      text        not null default 'Чеклист',
  position   int         not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists card_checklists_card_id_idx on card_checklists(card_id);

create table if not exists card_checklist_items (
  id           uuid        primary key default gen_random_uuid(),
  checklist_id uuid        not null references card_checklists(id) on delete cascade,
  title        text        not null check (length(trim(title)) > 0),
  is_checked   boolean     not null default false,
  position     int         not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists card_checklist_items_checklist_id_idx on card_checklist_items(checklist_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table card_checklists      enable row level security;
alter table card_checklist_items enable row level security;

-- is_card_member() was created in migration 005 and is reused here.

-- Checklists: all board members can manage
create policy "card_checklists_select"
  on card_checklists for select
  using (is_card_member(card_id));

create policy "card_checklists_insert"
  on card_checklists for insert
  with check (is_card_member(card_id));

create policy "card_checklists_update"
  on card_checklists for update
  using (is_card_member(card_id));

create policy "card_checklists_delete"
  on card_checklists for delete
  using (is_card_member(card_id));

-- Checklist items: accessible when the parent checklist's card is accessible
create or replace function public.is_checklist_member(p_checklist_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from   card_checklists cl
    join   cards            c  on c.id          = cl.card_id
    join   board_members    bm on bm.board_id   = c.board_id
    where  cl.id        = p_checklist_id
      and  bm.user_id   = auth.uid()
  );
$$;

create policy "card_checklist_items_select"
  on card_checklist_items for select
  using (is_checklist_member(checklist_id));

create policy "card_checklist_items_insert"
  on card_checklist_items for insert
  with check (is_checklist_member(checklist_id));

create policy "card_checklist_items_update"
  on card_checklist_items for update
  using (is_checklist_member(checklist_id));

create policy "card_checklist_items_delete"
  on card_checklist_items for delete
  using (is_checklist_member(checklist_id));
