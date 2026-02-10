create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  host_id uuid references public.users(id) on delete set null,

  video_id text,
  is_playing boolean default false,

  started_at timestamptz,
  paused_at numeric, -- seconds in video

  created_at timestamptz default now()
);

create table public.room_participants (
  room_id uuid references public.rooms(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  joined_at timestamptz default now(),

  role text check (role in ('host', 'viewer')) default 'viewer',

  primary key (room_id, user_id)
);

alter table public.users enable row level security;
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;

create policy "Users are viewable by everyone"
on public.users for select
using (true);

create policy "Users can update own profile"
on public.users for update
using (auth.uid() = id);

create policy "Authenticated users can create rooms"
on public.rooms for insert
with check (auth.role() = 'authenticated');

create policy "Participants visible to room members"
on public.room_participants for select
using (
  exists (
    select 1 from public.room_participants rp
    where rp.room_id = room_id
    and rp.user_id = auth.uid()
  )
);
