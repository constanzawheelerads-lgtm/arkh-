-- Synced study progress: one row per account. Only the owner can read or write it.
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "read own progress" on public.user_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own progress" on public.user_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own progress" on public.user_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Lets a signed-in person delete their own account and all its data
-- (required by the app stores). Cascades to user_progress and tutor_usage.
-- The Supabase advisor flags it as callable by signed-in users: that is the point,
-- and it can only ever delete the caller's own account.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
