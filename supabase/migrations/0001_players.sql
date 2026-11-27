-- SecOps Desktop: player accounts, attempts, badges and ranking.
-- Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- Safe by default: every table has Row Level Security (RLS); the browser only ever
-- uses the public "publishable" key, so these policies are what protects the data.

-- ---------------------------------------------------------------------------
-- Missions catalogue (public, read only). Keep in sync with src/content.
-- ---------------------------------------------------------------------------
create table public.missions (
  id          text primary key,
  track       text not null,
  difficulty  smallint not null check (difficulty between 1 and 3),
  max_score   integer not null check (max_score > 0),
  xp          integer not null check (xp > 0)
);

insert into public.missions (id, track, difficulty, max_score, xp) values
  ('soc-01', 'soc', 1, 19, 100);

alter table public.missions enable row level security;
create policy "missions are public" on public.missions for select using (true);

-- Badge catalogue (ids match src/core/progress.ts)
create table public.badges (
  id  text primary key,
  xp  integer not null default 25
);
insert into public.badges (id) values
  ('first_steps'), ('perfect'), ('flawless'), ('speed'), ('by_the_book'),
  ('contained'), ('polyglot'), ('cross_platform'), ('soc_track');

alter table public.badges enable row level security;
create policy "badges are public" on public.badges for select using (true);

-- ---------------------------------------------------------------------------
-- Profiles: one per account, created automatically on sign-up.
-- Public fields only: no email or other personal data is stored here.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name  text check (char_length(display_name) between 1 and 24),
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles are public" on public.profiles for select using (true);
create policy "players edit their own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- players may only change these two columns
revoke update on public.profiles from anon, authenticated;
grant update (username, display_name) on public.profiles to authenticated;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  base text := lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'user_name', 'analyst'), '[^a-zA-Z0-9_]', '', 'g'));
  candidate text;
begin
  if char_length(base) < 3 then base := 'analyst'; end if;
  base := left(base, 15);
  candidate := base;
  while exists (select 1 from public.profiles where username = candidate) loop
    candidate := base || '_' || substr(md5(random()::text), 1, 4);
  end loop;
  insert into public.profiles (id, username, display_name)
  values (new.id, candidate, left(coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'user_name'), 24));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Attempts: one row per finished mission. Players read and add only their own.
-- No update or delete from the browser, so results cannot be edited later.
-- ---------------------------------------------------------------------------
create table public.attempts (
  id            bigint generated always as identity primary key,
  user_id       uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  client_id     uuid not null,
  mission_id    text not null references public.missions (id),
  score         integer not null check (score >= 0),
  max_score     integer not null,
  pct           integer not null check (pct between 0 and 100),
  duration_sec  integer not null check (duration_sec between 0 and 86400),
  lang          text not null check (lang in ('en', 'pt', 'es', 'de', 'fr')),
  os            text not null check (os in ('windows', 'macos', 'linux')),
  played_at     timestamptz not null,
  created_at    timestamptz not null default now(),
  unique (user_id, client_id)
);
create index attempts_user_mission on public.attempts (user_id, mission_id);

-- Server-side sanity checks: the score must match the mission's real maximum,
-- pct is recomputed here, and the date cannot be in the future.
create function public.check_attempt()
returns trigger
language plpgsql
set search_path = ''
as $$
declare m_max integer;
begin
  select max_score into m_max from public.missions where id = new.mission_id;
  if new.max_score <> m_max or new.score > m_max then
    raise exception 'invalid score for mission %', new.mission_id;
  end if;
  new.pct := round(new.score * 100.0 / m_max);
  if new.played_at > now() + interval '5 minutes' then
    raise exception 'played_at is in the future';
  end if;
  return new;
end;
$$;

create trigger attempts_check before insert on public.attempts
  for each row execute function public.check_attempt();

alter table public.attempts enable row level security;
create policy "players read their own attempts" on public.attempts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "players add their own attempts" on public.attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Earned badges
-- ---------------------------------------------------------------------------
create table public.user_badges (
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  badge_id   text not null references public.badges (id),
  earned_at  timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.user_badges enable row level security;
create policy "badges earned are public" on public.user_badges for select using (true);
create policy "players add their own badges" on public.user_badges
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Ranking: XP = best score per mission x mission XP + badge XP.
-- Exposes only public fields (username, display name, totals).
-- ---------------------------------------------------------------------------
create function public.leaderboard(max_rows integer default 50)
returns table (rank bigint, username text, display_name text, xp bigint, missions bigint, badges bigint)
language sql
stable
security definer set search_path = ''
as $$
  with best as (
    select a.user_id, a.mission_id, max(a.pct) as pct
    from public.attempts a
    group by a.user_id, a.mission_id
  ),
  mission_xp as (
    select b.user_id, sum(round(m.xp * b.pct / 100.0))::bigint as xp, count(*) filter (where b.pct >= 60) as missions
    from best b join public.missions m on m.id = b.mission_id
    group by b.user_id
  ),
  badge_xp as (
    select ub.user_id, sum(bd.xp)::bigint as xp, count(*) as badges
    from public.user_badges ub join public.badges bd on bd.id = ub.badge_id
    group by ub.user_id
  )
  select
    rank() over (order by coalesce(mx.xp, 0) + coalesce(bx.xp, 0) desc) as rank,
    p.username,
    p.display_name,
    coalesce(mx.xp, 0) + coalesce(bx.xp, 0) as xp,
    coalesce(mx.missions, 0) as missions,
    coalesce(bx.badges, 0) as badges
  from public.profiles p
  left join mission_xp mx on mx.user_id = p.id
  left join badge_xp bx on bx.user_id = p.id
  where mx.user_id is not null or bx.user_id is not null
  order by xp desc, p.created_at
  limit least(greatest(max_rows, 1), 100);
$$;

revoke execute on function public.leaderboard(integer) from public;
grant execute on function public.leaderboard(integer) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- GDPR: players can delete their account and every row tied to it.
-- ---------------------------------------------------------------------------
create function public.delete_my_account()
returns void
language sql
security definer set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- internal functions are not callable from the API
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.check_attempt() from public, anon, authenticated;
