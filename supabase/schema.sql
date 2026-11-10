-- Pullayya Gari Cement Kottu: Supabase setup for the admin panel.
-- Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- Then add your admin email at the bottom and run that line too.

-- 1. All site content lives in one table.
--    kind: 'brand' | 'category' | 'product' | 'guide' | 'about' | 'settings'
create table if not exists public.content (
  kind       text        not null,
  id         text        not null,
  sort       integer     not null default 0,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (kind, id)
);

-- 2. Who may edit. Only emails listed here can write, even if someone else signs up.
create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

alter table public.content enable row level security;
alter table public.admins  enable row level security;   -- no policies: nobody reads it through the API

drop policy if exists "content: anyone can read" on public.content;
create policy "content: anyone can read" on public.content for select using (true);

drop policy if exists "content: admins write" on public.content;
create policy "content: admins write" on public.content for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 3. Public bucket for photos, videos and logos uploaded from the admin panel.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media: anyone can read" on storage.objects;
create policy "media: anyone can read" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "media: admins upload" on storage.objects;
create policy "media: admins upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admins change" on storage.objects;
create policy "media: admins change" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admins delete" on storage.objects;
create policy "media: admins delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- 4. Your admin login. Change the email, run this line, then create the same user under
--    Authentication > Users > Add user (with a password).
-- insert into public.admins (email) values ('you@example.com') on conflict do nothing;
