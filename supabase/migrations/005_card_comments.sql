-- 005_card_comments.sql
-- Adds comments to kanban cards with RLS and realtime support.

-- ── Table ────────────────────────────────────────────────────────────────────
create table if not exists card_comments (
  id          uuid        primary key default gen_random_uuid(),
  card_id     uuid        not null references cards(id) on delete cascade,
  author_id   uuid        not null references auth.users(id),
  -- Denormalized display name for fast rendering (avoids joins in every query)
  author_name text,
  body        text        not null check (length(trim(body)) > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists card_comments_card_id_idx on card_comments(card_id);

-- ── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger card_comments_updated_at
  before update on card_comments
  for each row execute function public.set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table card_comments enable row level security;

-- security definer helper: is the current user a member of the board that
-- owns this card? Using security definer avoids recursive RLS lookups into
-- board_members (same pattern as migrations 003/004).
create or replace function public.is_card_member(p_card_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from   cards        c
    join   board_members bm on bm.board_id = c.board_id
    where  c.id         = p_card_id
      and  bm.user_id   = auth.uid()
  );
$$;

-- Board members can read all comments on their cards
create policy "card_comments_select"
  on card_comments for select
  using (is_card_member(card_id));

-- Board members can post comments (author must be themselves)
create policy "card_comments_insert"
  on card_comments for insert
  with check (
    author_id = auth.uid()
    and is_card_member(card_id)
  );

-- Authors can edit their own comments
create policy "card_comments_update"
  on card_comments for update
  using (author_id = auth.uid());

-- Authors can delete their own comments
create policy "card_comments_delete"
  on card_comments for delete
  using (author_id = auth.uid());

-- ── Realtime ─────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table card_comments;
