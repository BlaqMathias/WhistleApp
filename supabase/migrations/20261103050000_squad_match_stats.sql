-- Apply after both previous match-player / fixture-page migrations.
-- Adds display-only per-match goal/assist totals; does not alter scores, Ws or player details.
begin;
-- Match-only totals are calculated from validated identities before display data is sanitized.
-- Current roster plus recorded participants keeps highlights visible after a roster change.
create or replace function public.whistle_fixture_squad(p_fixture_id uuid,p_side text)
returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; v_team uuid; goals jsonb:='[]'; players jsonb;
begin
 if p_side not in ('home','away') or p_side is null then raise exception 'Choose a match side.'; end if;
 select * into strict f from fixtures where id=p_fixture_id;
 v_team:=case when p_side='home' then f.home_team_id else f.away_team_id end;
 if f.sport='football' and f.status in ('live','completed') then
  goals:=coalesce(f.player_details->'goals','[]'::jsonb);
 end if;
 with roster as (
  select s.id,s.name from students s where not s.is_admin and
   ((f.league_id is not null and exists(select 1 from league_players lp where lp.league_id=f.league_id and lp.team_id=v_team and lp.student_id=s.id))
    or (f.league_id is null and exists(select 1 from team_players tp where tp.team_id=v_team and tp.student_id=s.id)))
 ), recorded as (
  select distinct on (coalesce(p->>'student_id',lower(trim(p->>'name'))))
   (p->>'student_id')::uuid id,trim(p->>'name') name
  from jsonb_array_elements(goals) g
  cross join lateral (values(g->'scorer'),(g->'assist')) participant(p)
  where g->>'side'=p_side and p is not null and p<>'null'::jsonb
  order by coalesce(p->>'student_id',lower(trim(p->>'name'))),trim(p->>'name')
 ), participants as (
  select * from roster
  union all select r.* from recorded r where r.id is null or not exists(select 1 from roster s where s.id=r.id)
 )
 select coalesce(jsonb_agg(jsonb_build_object('name',p.name,
  'goals',(select count(*) from jsonb_array_elements(goals) g where g->>'side'=p_side and
   case when p.id is not null then g->'scorer'->>'student_id'=p.id::text
    else g->'scorer'->>'student_id' is null and lower(trim(g->'scorer'->>'name'))=lower(p.name) end),
  'assists',(select count(*) from jsonb_array_elements(goals) g where g->>'side'=p_side and
   case when p.id is not null then g->'assist'->>'student_id'=p.id::text
    else g->'assist'->>'student_id' is null and lower(trim(g->'assist'->>'name'))=lower(p.name) end)
 ) order by p.name,p.id),'[]'::jsonb) into players from participants p;
 return players;
end $$;


create or replace function public.public_fixture(p_fixture_id uuid,p_student_id uuid default null)
returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; squads jsonb:='{}'; v_side text; v_team uuid; players jsonb;
begin
 select * into f from fixtures where id=p_fixture_id;
 if not found or (f.league_id is not null and not exists(select 1 from leagues where id=f.league_id and status='active')) then return null; end if;
 if p_student_id is not null then perform whistle_student(p_student_id); end if;
 foreach v_side in array array['home','away'] loop
  v_team:=case when v_side='home' then f.home_team_id else f.away_team_id end;
  players:=whistle_fixture_squad(f.id,v_side);
  squads:=squads||jsonb_build_object(v_side,players);
 end loop;
 return jsonb_build_object(
  'fixture',(to_jsonb(f)-'player_details')||jsonb_build_object('player_details',whistle_public_player_details(f.player_details)),
  'teams',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'sport',sport,'logo_initials',logo_initials,'logo_path',logo_path)),'[]') from teams where id in (f.home_team_id,f.away_team_id)),
  'league',(select to_jsonb(l) from leagues l where id=f.league_id),
  'standings',case when f.league_id is not null then admin_standings(f.league_id) else '[]'::jsonb end,
  'squads',squads,'poll',whistle_poll_snapshot(f.id,p_student_id));
end $$;
revoke execute on function public.whistle_fixture_squad(uuid,text),public.public_fixture(uuid,uuid) from public,anon,authenticated;
grant execute on function public.whistle_fixture_squad(uuid,text),public.public_fixture(uuid,uuid) to service_role;
notify pgrst, 'reload schema';
commit;
