-- Database security tests: run after 00_local_auth_stub.sql and the migrations.
-- Each block raises an error (and fails CI) if a rule does not hold.
\set ON_ERROR_STOP 1

create function pg_temp.expect_error(sql text, what text) returns void language plpgsql as $$
begin
  execute sql;
  raise exception 'SECURITY TEST FAILED: % was allowed', what;
exception when others then
  if sqlerrm like 'SECURITY TEST FAILED%' then raise; end if;
end $$;
grant execute on function pg_temp.expect_error(text, text) to anon, authenticated;

insert into auth.users (id, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', '{"user_name":"ThuanyKamers","name":"Thuany Kamers"}'),
  ('22222222-2222-2222-2222-222222222222', '{"user_name":"ThuanyKamers"}'),
  ('33333333-3333-3333-3333-333333333333', '{}');

do $$ begin
  assert (select count(*) from public.profiles) = 3, 'a profile is created for every new account';
  assert (select count(distinct username) from public.profiles) = 3, 'usernames stay unique';
end $$;

set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

insert into public.attempts (client_id, mission_id, score, max_score, pct, duration_sec, lang, os, played_at)
values (gen_random_uuid(), 'soc-01', 19, 19, 1, 500, 'pt', 'linux', now());

do $$ begin
  assert (select pct from public.attempts limit 1) = 100, 'pct is recomputed by the server';
end $$;

select pg_temp.expect_error($q$insert into public.attempts (client_id, mission_id, score, max_score, pct, duration_sec, lang, os, played_at) values (gen_random_uuid(), 'soc-01', 999, 999, 100, 1, 'pt', 'linux', now())$q$, 'a score above the mission maximum');
select pg_temp.expect_error($q$insert into public.attempts (client_id, mission_id, score, max_score, pct, duration_sec, lang, os, played_at) values (gen_random_uuid(), 'soc-01', 1, 19, 5, 1, 'pt', 'linux', now() + interval '1 day')$q$, 'an attempt dated in the future');
select pg_temp.expect_error($q$insert into public.attempts (user_id, client_id, mission_id, score, max_score, pct, duration_sec, lang, os, played_at) values ('22222222-2222-2222-2222-222222222222', gen_random_uuid(), 'soc-01', 19, 19, 100, 1, 'pt', 'linux', now())$q$, 'adding an attempt for another player');
select pg_temp.expect_error($q$update public.profiles set id = '22222222-2222-2222-2222-222222222222'$q$, 'changing a profile id');
select pg_temp.expect_error($q$insert into public.user_badges (badge_id) values ('not_a_badge')$q$, 'an unknown badge');
select pg_temp.expect_error($q$insert into public.user_badges (user_id, badge_id) values ('22222222-2222-2222-2222-222222222222', 'perfect')$q$, 'giving a badge to another player');

update public.attempts set score = 0;
delete from public.attempts;
update public.profiles set username = 'hacked' where id = '22222222-2222-2222-2222-222222222222';
update public.profiles set username = 'thuany';
insert into public.user_badges (badge_id) values ('perfect');

do $$ begin
  assert (select score from public.attempts limit 1) = 19, 'attempts cannot be edited';
  assert (select count(*) from public.attempts) = 1, 'attempts cannot be deleted';
  assert (select username from public.profiles where id = '22222222-2222-2222-2222-222222222222') <> 'hacked', 'players cannot edit other profiles';
  assert (select username from public.profiles where id = '11111111-1111-1111-1111-111111111111') = 'thuany', 'players can edit their own profile';
end $$;

set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
do $$ begin
  assert (select count(*) from public.attempts) = 0, 'players only see their own attempts';
end $$;

reset role;
set role anon;
reset request.jwt.claim.sub;
select pg_temp.expect_error($q$insert into public.user_badges (user_id, badge_id) values ('11111111-1111-1111-1111-111111111111', 'speed')$q$, 'anonymous badge insert');
select pg_temp.expect_error($q$select public.delete_my_account()$q$, 'anonymous account deletion');
do $$ begin
  assert (select xp from public.leaderboard() where username = 'thuany') = 125, 'leaderboard = 100 mission XP + 25 badge XP';
  assert (select count(*) from public.leaderboard()) = 1, 'players without results are not listed';
end $$;

reset role;
set role authenticated;
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
select public.delete_my_account();
reset role;
do $$ begin
  assert not exists (select 1 from auth.users where id = '33333333-3333-3333-3333-333333333333'), 'players can delete their own account';
  assert (select count(*) from auth.users) = 2, 'deleting an account removes only that account';
end $$;

-- ---- profile photos ----
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
insert into storage.objects (bucket_id, name) values ('avatars', '11111111-1111-1111-1111-111111111111/avatar.webp');
update public.profiles set avatar_url = 'https://secdwzevrkspozkaehgt.supabase.co/storage/v1/object/public/avatars/11111111-1111-1111-1111-111111111111/avatar.webp?v=1';
select pg_temp.expect_error($q$insert into storage.objects (bucket_id, name) values ('avatars', '22222222-2222-2222-2222-222222222222/avatar.webp')$q$, 'uploading into another player''s folder');
select pg_temp.expect_error($q$insert into storage.objects (bucket_id, name) values ('avatars', 'avatar.webp')$q$, 'uploading outside a player folder');
select pg_temp.expect_error($q$update public.profiles set avatar_url = 'https://evil.example/pixel.gif'$q$, 'an avatar URL outside the project');
select pg_temp.expect_error($q$update public.profiles set avatar_url = 'https://secdwzevrkspozkaehgt.supabase.co/storage/v1/object/public/avatars/22222222-2222-2222-2222-222222222222/avatar.webp'$q$, 'pointing your avatar at another player''s photo');
reset role;
set role anon;
reset request.jwt.claim.sub;
select pg_temp.expect_error($q$insert into storage.objects (bucket_id, name) values ('avatars', '11111111-1111-1111-1111-111111111111/x.webp')$q$, 'anonymous upload');
do $$ begin
  assert (select avatar_url from public.leaderboard() where username = 'thuany') like '%/avatars/11111111-%', 'leaderboard returns the photo';
  assert (select file_size_limit from storage.buckets where id = 'avatars') = 204800, 'bucket limits photos to 200 KB';
end $$;
reset role;

\echo 'All database security tests passed.'
