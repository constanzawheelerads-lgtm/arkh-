-- The daily counter can only be changed by the Mysterium Edge Function
-- (service role), never directly by the app. Replaces the functions from the
-- previous migration, which signed-in users could call to reset their own count.

drop function if exists public.tutor_consume(integer);
drop function if exists public.tutor_refund();

create or replace function public.tutor_consume(p_user uuid, p_limit integer)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_used integer;
begin
  insert into tutor_usage (user_id, day, used)
  values (p_user, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, day) do update
    set used = tutor_usage.used + 1
    where tutor_usage.used < p_limit
  returning used into v_used;

  if v_used is null then
    select used into v_used from tutor_usage where user_id = p_user and day = (now() at time zone 'utc')::date;
    return json_build_object('allowed', false, 'used', v_used);
  end if;
  return json_build_object('allowed', true, 'used', v_used);
end;
$$;

create or replace function public.tutor_refund(p_user uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update tutor_usage set used = greatest(used - 1, 0)
  where user_id = p_user and day = (now() at time zone 'utc')::date;
$$;

revoke all on function public.tutor_consume(uuid, integer) from public, anon, authenticated;
revoke all on function public.tutor_refund(uuid) from public, anon, authenticated;
grant execute on function public.tutor_consume(uuid, integer) to service_role;
grant execute on function public.tutor_refund(uuid) to service_role;
