-- SecOps Desktop: badges for playing on consecutive days.
-- Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
insert into public.badges (id) values ('streak_3'), ('streak_7')
on conflict (id) do nothing;
