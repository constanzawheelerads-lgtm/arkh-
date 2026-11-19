-- Daily message counter for Mysterium (15 free messages per person per day).
-- Each row belongs to one Supabase user (anonymous users included).

create table if not exists public.tutor_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default (now() at time zone 'utc')::date,
  used integer not null default 0 check (used >= 0),
  primary key (user_id, day)
);

alter table public.tutor_usage enable row level security;

-- People can read their own counter; only the functions below can change it.
create policy "read own usage" on public.tutor_usage
  for select using (auth.uid() = user_id);

-- Atomically counts one message if the person is under the limit.
create or replace function public.tutor_consume(p_limit integer)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_used integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  insert into tutor_usage (user_id, day, used)
  values (auth.uid(), (now() at time zone 'utc')::date, 1)
  on conflict (user_id, day) do update
    set used = tutor_usage.used + 1
    where tutor_usage.used < p_limit
  returning used into v_used;

  if v_used is null then
    select used into v_used from tutor_usage where user_id = auth.uid() and day = (now() at time zone 'utc')::date;
    return json_build_object('allowed', false, 'used', v_used);
  end if;
  return json_build_object('allowed', true, 'used', v_used);
end;
$$;

-- Gives a message back when the AI call failed.
create or replace function public.tutor_refund()
returns void
language sql
security definer
set search_path = public
as $$
  update tutor_usage set used = greatest(used - 1, 0)
  where user_id = auth.uid() and day = (now() at time zone 'utc')::date;
$$;

revoke all on function public.tutor_consume(integer) from public;
revoke all on function public.tutor_refund() from public;
grant execute on function public.tutor_consume(integer) to authenticated;
grant execute on function public.tutor_refund() to authenticated;
