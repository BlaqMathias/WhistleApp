begin;

-- Rank the same campus accounts using settlements for the selected sport.
create or replace function public.student_sport_leaderboard(p_student_id uuid, p_sport public.sport)
returns jsonb language plpgsql stable set search_path=public as $$
begin
  perform whistle_student(p_student_id);

  return (
    with settled as (
      select w.student_id,
             sum(w.delta) as ws,
             count(*)::integer as predictions,
             count(*) filter (where w.delta = 50)::integer as correct
      from ws_ledger w
      join fixtures f on f.id = w.fixture_id
      where f.sport = p_sport
      group by w.student_id
    ), totals as (
      select s.id as student_id, s.name, s.faculty,
             coalesce(w.ws, 0) as ws,
             coalesce(w.predictions, 0) as predictions,
             coalesce(w.correct, 0) as correct
      from students s
      left join settled w on w.student_id = s.id
      where not s.is_admin
    ), ranked as (
      select (rank() over (order by ws desc))::integer as rank, *,
             student_id = p_student_id as is_me
      from totals
    )
    select coalesce(jsonb_agg(to_jsonb(r) - 'student_id' order by r.rank, r.name, r.student_id), '[]')
    from ranked r
  );
end $$;

revoke execute on function public.student_sport_leaderboard(uuid, public.sport) from public, anon, authenticated;
grant execute on function public.student_sport_leaderboard(uuid, public.sport) to service_role;

notify pgrst, 'reload schema';
commit;
