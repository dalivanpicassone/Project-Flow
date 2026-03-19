-- Add explicit WITH CHECK clauses to FOR ALL policies on columns and cards.
-- PostgreSQL applies USING as WITH CHECK when WITH CHECK is omitted for FOR ALL,
-- but being explicit prevents INSERT from bypassing the intended row-level restriction.

drop policy if exists "Columns manageable by board members" on public.columns;
create policy "Columns manageable by board members"
  on public.columns for all
  using (
    public.is_board_owner(board_id, auth.uid())
    or public.is_board_member(board_id, auth.uid())
  )
  with check (
    public.is_board_owner(board_id, auth.uid())
    or public.is_board_member(board_id, auth.uid())
  );

drop policy if exists "Cards manageable by board members" on public.cards;
create policy "Cards manageable by board members"
  on public.cards for all
  using (
    public.is_board_owner(board_id, auth.uid())
    or public.is_board_member(board_id, auth.uid())
  )
  with check (
    public.is_board_owner(board_id, auth.uid())
    or public.is_board_member(board_id, auth.uid())
  );

-- Fix handle_new_user SECURITY DEFINER function missing SET search_path.
-- Without this, a malicious schema could shadow public.profiles.
alter function public.handle_new_user() set search_path = public;
