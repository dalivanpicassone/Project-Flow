-- Fix recursive RLS policy on board_members that can cause 500 errors
-- when selecting boards/columns/cards through PostgREST.

drop policy if exists "Board members visible to board members" on public.board_members;

create policy "Board members visible to owner or self"
  on public.board_members for select
  using (
    user_id = auth.uid()
    or board_id in (select id from public.boards where owner_id = auth.uid())
  );