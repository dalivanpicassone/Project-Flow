-- Fix circular RLS evaluation between boards and board_members policies.
-- This avoids Postgres error 42P17: "infinite recursion detected in policy".

create or replace function public.is_board_owner(target_board_id uuid, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.boards b
    where b.id = target_board_id and b.owner_id = target_user_id
  );
$$;

create or replace function public.is_board_member(target_board_id uuid, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.board_members bm
    where bm.board_id = target_board_id and bm.user_id = target_user_id
  );
$$;

drop policy if exists "Boards visible to members" on public.boards;
create policy "Boards visible to members"
  on public.boards for select
  using (
    owner_id = auth.uid()
    or public.is_board_member(id, auth.uid())
  );

drop policy if exists "Board members visible to board members" on public.board_members;
drop policy if exists "Board members visible to owner or self" on public.board_members;
create policy "Board members visible to owner or self"
  on public.board_members for select
  using (
    user_id = auth.uid()
    or public.is_board_owner(board_id, auth.uid())
  );

drop policy if exists "Columns visible to board members" on public.columns;
create policy "Columns visible to board members"
  on public.columns for select
  using (
    public.is_board_owner(board_id, auth.uid())
    or public.is_board_member(board_id, auth.uid())
  );

drop policy if exists "Columns manageable by board members" on public.columns;
create policy "Columns manageable by board members"
  on public.columns for all
  using (
    public.is_board_owner(board_id, auth.uid())
    or public.is_board_member(board_id, auth.uid())
  );

drop policy if exists "Cards visible to board members" on public.cards;
create policy "Cards visible to board members"
  on public.cards for select
  using (
    public.is_board_owner(board_id, auth.uid())
    or public.is_board_member(board_id, auth.uid())
  );

drop policy if exists "Cards manageable by board members" on public.cards;
create policy "Cards manageable by board members"
  on public.cards for all
  using (
    public.is_board_owner(board_id, auth.uid())
    or public.is_board_member(board_id, auth.uid())
  );