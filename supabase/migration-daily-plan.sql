-- Run ONCE in Supabase > SQL Editor (safe even if you never ran the earlier version).

-- 1) Undo the earlier Ritual version: remove auto-added tasks and their columns
do $$ begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'tasks' and column_name = 'plan_date') then
    execute 'delete from tasks where plan_date is not null';
  end if;
end $$;
alter table tasks drop column if exists plan_date;
alter table tasks drop column if exists hidden;

-- 2) Daily plan now lives in Evolve (workouts)
alter table workouts add column if not exists plan_date date;
alter table workouts add column if not exists hidden boolean default false;
alter table workouts add constraint workouts_user_plan_date_key unique (user_id, plan_date);
