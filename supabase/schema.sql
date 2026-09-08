-- ==================================================================
--  J & L Wedding — Supabase schema
--  Run this once in the Supabase Dashboard -> SQL Editor -> New query.
--  Safe to re-run: every statement is idempotent.
-- ==================================================================

-- ------------------------------------------------------------------
-- 1. RSVP replies
-- ------------------------------------------------------------------
create table if not exists public.rsvps (
  id            uuid primary key default gen_random_uuid(),
  full_name     text        not null check (char_length(trim(full_name)) between 1 and 120),
  email         text,
  phone         text,
  attending     boolean     not null,
  party_size    integer     not null default 1 check (party_size between 0 and 20),
  guest_names   text,
  dietary_notes text,
  message       text,
  created_at    timestamptz not null default now()
);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);

alter table public.rsvps enable row level security;

-- Guests may leave a reply, but may not read, edit or delete any reply.
-- The couple reads the list in the Supabase dashboard, which bypasses RLS.
drop policy if exists "Guests can submit an RSVP" on public.rsvps;
create policy "Guests can submit an RSVP"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (
    char_length(trim(full_name)) > 0
    and party_size between 0 and 20
    and char_length(coalesce(message, '')) <= 2000
    and char_length(coalesce(guest_names, '')) <= 500
    and char_length(coalesce(dietary_notes, '')) <= 500
  );

-- ------------------------------------------------------------------
-- 2. Gallery media (highlights, venue photos, dress-code inspiration)
--    `url` may hold either a full public URL or a path inside the
--    `wedding-media` bucket, e.g. 'highlights/beach-01.jpg'.
-- ------------------------------------------------------------------
create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  category   text        not null check (category in ('highlight', 'venue', 'dress_code')),
  media_type text        not null default 'image' check (media_type in ('image', 'video')),
  url        text        not null,
  caption    text,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists media_category_sort_idx
  on public.media (category, sort_order);

alter table public.media enable row level security;

-- Anyone may view the gallery; only the dashboard/service role may change it.
drop policy if exists "Gallery is publicly readable" on public.media;
create policy "Gallery is publicly readable"
  on public.media
  for select
  to anon, authenticated
  using (true);

-- ------------------------------------------------------------------
-- 3. Storage bucket for photos and videos
-- ------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('wedding-media', 'wedding-media', true)
on conflict (id) do update set public = true;

-- Public read access to objects in that bucket.
drop policy if exists "Wedding media is publicly readable" on storage.objects;
create policy "Wedding media is publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'wedding-media');

-- ==================================================================
--  Handy queries for the couple
-- ==================================================================
-- Everyone who is coming, and the head count:
--   select full_name, party_size, guest_names, dietary_notes, message, created_at
--   from public.rsvps where attending order by created_at desc;
--
--   select coalesce(sum(party_size), 0) as total_guests
--   from public.rsvps where attending;
--
-- Regrets:
--   select full_name, message, created_at
--   from public.rsvps where not attending order by created_at desc;
