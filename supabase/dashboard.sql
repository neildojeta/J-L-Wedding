-- ==================================================================
--  J & L Wedding — private RSVP dashboard
--  Run this in the Supabase Dashboard -> SQL Editor AFTER schema.sql.
--  Safe to re-run: every statement is idempotent.
--
--  What this adds: the couple, signed in, can read and delete RSVP
--  replies. Nobody else can, including any other signed-in account.
--
--  READ THIS BEFORE CHANGING IT
--  The site is a static page holding only the anon key, so the browser
--  cannot be trusted to decide who is an admin — a password check in
--  JavaScript is decoration, and anyone can call the API directly with
--  the anon key that ships in the bundle. The protection has to live
--  here, in row-level security, and it does: the policies below grant
--  nothing to `anon` at all.
--
--  Note also what is NOT written below: a policy granting select to
--  `authenticated`. That would let ANY account read every reply, and if
--  email sign-ups are ever left on, "any account" means anyone at all.
--  Access is granted to named people only, via the admins table.
-- ==================================================================

-- ------------------------------------------------------------------
-- 1. Who counts as the couple
-- ------------------------------------------------------------------
create table if not exists public.admins (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);

-- No policies are written for this table, and that is on purpose: with
-- RLS on and no policy, it is invisible through the API to every role.
-- Only the SQL editor and the function below can see it, so the guest
-- list of who-can-read-RSVPs is not itself readable by guests.
alter table public.admins enable row level security;

-- ------------------------------------------------------------------
-- 2. The check
--
--    security definer so it runs as the owner and can therefore read
--    public.admins despite the RLS above. search_path is pinned: a
--    security definer function that resolves names through the caller's
--    search_path can be tricked into running someone else's `admins`.
-- ------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------------
-- 3. What the couple may do with the replies
--    Read and delete. Deliberately no update: an RSVP is what the guest
--    said, and silently editing it would make the list untrustworthy.
-- ------------------------------------------------------------------
drop policy if exists "Couple can read replies" on public.rsvps;
create policy "Couple can read replies"
  on public.rsvps
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Couple can delete replies" on public.rsvps;
create policy "Couple can delete replies"
  on public.rsvps
  for delete
  to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------------
-- 4. Add yourselves
--
--    Create the account first: Dashboard -> Authentication -> Users ->
--    Add user, with a real email and a strong password. Then put that
--    same email here, lowercase.
--
--    Then turn OFF public sign-ups, so nobody can create an account of
--    their own: Authentication -> Sign In / Providers -> Email ->
--    "Allow new users to sign up" off. Belt and braces — the policies
--    above already require the address to be listed here.
-- ------------------------------------------------------------------
-- insert into public.admins (email, note) values
--   ('you@example.com', 'Jonmark'),
--   ('them@example.com', 'Linneth')
-- on conflict (email) do nothing;

-- ------------------------------------------------------------------
--  Check it worked, signed in as the couple:
--    select public.is_admin();          -- expect true
--    select count(*) from public.rsvps; -- expect the real number
-- ------------------------------------------------------------------
