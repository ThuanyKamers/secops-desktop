-- SecOps Desktop: profile photos.
-- Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.

-- Public bucket: anyone can view a photo by its URL, but the bucket itself
-- refuses files over 200 KB and anything that is not a PNG, JPEG or WebP image.
-- (The game resizes photos to 256x256 WebP in the browser, usually ~20 KB.)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 204800, array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Each player can only write inside a folder named after their own user id: avatars/<uid>/...
create policy "players read their own avatar files" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "players upload their own avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "players replace their own avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "players delete their own avatar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- The profile points at the photo. Only URLs inside this project's avatars bucket,
-- in the player's own folder, are accepted (no tracking pixels or outside links).
alter table public.profiles add column avatar_url text;
alter table public.profiles add constraint avatar_url_own_bucket check (
  avatar_url is null
  or avatar_url like 'https://secdwzevrkspozkaehgt.supabase.co/storage/v1/object/public/avatars/' || id::text || '/%'
);
grant update (avatar_url) on public.profiles to authenticated;

-- Ranking now also returns the photo.
drop function public.leaderboard(integer);
create function public.leaderboard(max_rows integer default 50)
returns table (rank bigint, username text, display_name text, avatar_url text, xp bigint, missions bigint, badges bigint)
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
    p.avatar_url,
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
