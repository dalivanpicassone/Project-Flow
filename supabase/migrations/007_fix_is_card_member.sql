-- 007_fix_is_card_member.sql
-- Fix is_card_member() and is_checklist_member() to include board owner,
-- consistent with how cards/columns policies work (owner_id OR board_members).

create or replace function public.is_card_member(p_card_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from  cards c
    join  boards b on b.id = c.board_id
    where c.id = p_card_id
      and (
        b.owner_id = auth.uid()
        or exists (
          select 1 from board_members bm
          where bm.board_id = c.board_id
            and bm.user_id  = auth.uid()
        )
      )
  );
$$;

create or replace function public.is_checklist_member(p_checklist_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from  card_checklists cl
    join  cards           c  on c.id  = cl.card_id
    join  boards          b  on b.id  = c.board_id
    where cl.id = p_checklist_id
      and (
        b.owner_id = auth.uid()
        or exists (
          select 1 from board_members bm
          where bm.board_id = c.board_id
            and bm.user_id  = auth.uid()
        )
      )
  );
$$;
