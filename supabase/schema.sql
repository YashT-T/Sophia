-- Run this whole file in Supabase > SQL Editor

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text, avatar_url text, xp int not null default 0
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null, due_at timestamptz not null,
  done boolean default false, completed_at timestamptz,
  penalized boolean default false, xp_awarded int default 0,
  created_at timestamptz default now()
);
create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null, minutes int not null default 30, day date not null default current_date,
  done boolean default false, completed_at timestamptz, xp_awarded int default 0,
  plan_date date, hidden boolean default false, -- plan_date = auto-added from the weekday plan
  created_at timestamptz default now(),
  unique (user_id, plan_date)
);
create table week_plan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  day int not null, label text not null default '',
  unique (user_id, day)
);
create table reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null, remind_at timestamptz not null,
  mode text not null default 'popup', fired boolean default false,
  created_at timestamptz default now()
);
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null, streak int default 0, last_done date,
  created_at timestamptz default now()
);
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null, created_at timestamptz default now()
);
create table pdfs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null, category_id uuid references categories on delete set null,
  due_date date, file_path text not null,
  done boolean default false, completed_at timestamptz,
  penalized boolean default false, xp_awarded int default 0,
  created_at timestamptz default now()
);
create table titles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null, format text default 'Movie', genre text, notes text,
  done boolean default false, completed_at timestamptz, xp_awarded int default 0,
  created_at timestamptz default now()
);

-- Row level security: everyone only sees their own rows
alter table profiles enable row level security;
create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['tasks','workouts','week_plan','reminders','habits','categories','pdfs','titles'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "own rows" on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;

-- Atomic XP change (never below 0)
create function add_xp(delta int) returns int language sql security definer set search_path = public as $$
  update profiles set xp = greatest(0, xp + delta) where id = auth.uid() returning xp
$$;

-- Auto-create profile + starter categories on signup
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  insert into categories (user_id, name) select new.id, unnest(array['Psychology','Public speaking','Podcast','Tech','Bio']);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- Storage: avatars (public read) and pdfs (private)
insert into storage.buckets (id, name, public) values ('avatars','avatars',true), ('pdfs','pdfs',false) on conflict do nothing;
create policy "avatars public read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars own write" on storage.objects for all
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "pdfs own files" on storage.objects for all
  using (bucket_id = 'pdfs' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'pdfs' and (storage.foldername(name))[1] = auth.uid()::text);
