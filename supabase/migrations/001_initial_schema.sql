-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Boards table
create table public.boards (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  color text,
  is_archived boolean default false not null,
  created_at timestamptz default now() not null
);

-- Board members table
create table public.board_members (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references public.boards(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('owner', 'member')) default 'member' not null,
  joined_at timestamptz default now() not null,
  unique(board_id, user_id)
);

-- Columns table
create table public.columns (
  id uuid default uuid_generate_v4() primary key,
  board_id uuid references public.boards(id) on delete cascade not null,
  title text not null,
  position integer not null default 0,
  wip_limit integer,
  color text,
  created_at timestamptz default now() not null
);

-- Cards table
create table public.cards (
  id uuid default uuid_generate_v4() primary key,
  column_id uuid references public.columns(id) on delete cascade not null,
  board_id uuid references public.boards(id) on delete cascade not null,
  title text not null,
  description text,
  priority text check (priority in ('critical', 'high', 'medium', 'low')) default 'medium' not null,
  assignee_id uuid references public.profiles(id) on delete set null,
  due_date date,
  labels text[],
  position integer not null default 0,
  moved_at timestamptz,
  created_at timestamptz default now() not null
);

-- ── Row Level Security ──────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.board_members enable row level security;
alter table public.columns enable row level security;
alter table public.cards enable row level security;

-- Profiles: users can read all profiles, update only their own
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Boards: visible if owner OR member
create policy "Boards visible to members"
  on public.boards for select
  using (
    owner_id = auth.uid() or
    id in (select board_id from public.board_members where user_id = auth.uid())
  );

create policy "Boards insertable by owner"
  on public.boards for insert with check (owner_id = auth.uid());

create policy "Boards updatable by owner"
  on public.boards for update using (owner_id = auth.uid());

create policy "Boards deletable by owner"
  on public.boards for delete using (owner_id = auth.uid());

-- Board members
create policy "Board members visible to board members"
  on public.board_members for select
  using (
    board_id in (select board_id from public.board_members where user_id = auth.uid())
  );

create policy "Board members insertable by board owner"
  on public.board_members for insert
  with check (
    board_id in (select id from public.boards where owner_id = auth.uid())
  );

-- Columns: accessible if user is board member
create policy "Columns visible to board members"
  on public.columns for select
  using (
    board_id in (
      select id from public.boards where owner_id = auth.uid()
      union
      select board_id from public.board_members where user_id = auth.uid()
    )
  );

create policy "Columns manageable by board members"
  on public.columns for all
  using (
    board_id in (
      select id from public.boards where owner_id = auth.uid()
      union
      select board_id from public.board_members where user_id = auth.uid()
    )
  );

-- Cards: accessible if user is board member
create policy "Cards visible to board members"
  on public.cards for select
  using (
    board_id in (
      select id from public.boards where owner_id = auth.uid()
      union
      select board_id from public.board_members where user_id = auth.uid()
    )
  );

create policy "Cards manageable by board members"
  on public.cards for all
  using (
    board_id in (
      select id from public.boards where owner_id = auth.uid()
      union
      select board_id from public.board_members where user_id = auth.uid()
    )
  );

-- ── Triggers ────────────────────────────────────────────────────────────────

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Realtime for columns and cards
alter publication supabase_realtime add table public.columns;
alter publication supabase_realtime add table public.cards;