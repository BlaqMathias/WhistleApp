-- Run after 20261102_match_player_details.sql on an existing Whistle v2 database.
-- Read-only fixture views and league form. No existing rows are deleted/changed.
begin;
create or replace function public.whistle_recent_form(p_league_id uuid,p_team_id uuid)
returns jsonb language sql set search_path=public as $$
 select coalesce(jsonb_agg(jsonb_build_object(
  'result',case when f.winner_side is null then 'D'
    when (f.winner_side='home' and f.home_team_id=p_team_id) or (f.winner_side='away' and f.away_team_id=p_team_id) then 'W' else 'L' end,
  'opponent',case when f.home_team_id=p_team_id then coalesce(a.name,f.away_name) else coalesce(h.name,f.home_name) end,
  'score',case when f.status='walkover' then 'Walkover'
    when f.sport='volleyball' then (case when f.home_team_id=p_team_id then f.home_sets||'–'||f.away_sets else f.away_sets||'–'||f.home_sets end)||' sets'
    else case when f.home_team_id=p_team_id then f.home_score||'–'||f.away_score else f.away_score||'–'||f.home_score end end
 ) order by f.ended_at,f.created_at,f.id),'[]'::jsonb)
 from (select * from fixtures where league_id=p_league_id and (home_team_id=p_team_id or away_team_id=p_team_id)
   and status in ('completed','walkover') order by ended_at desc,created_at desc,id desc limit 5) f
 left join teams h on h.id=f.home_team_id left join teams a on a.id=f.away_team_id
$$;
create or replace function public.admin_standings(p_league_id uuid) returns jsonb language sql set search_path=public as $$
 select coalesce(jsonb_agg(to_jsonb(s)||jsonb_build_object('form',whistle_recent_form(s.league_id,s.team_id)) order by rank,name),'[]')
 from standings s where league_id=p_league_id
$$;
create or replace function public.public_home() returns jsonb language sql set search_path=public as $$
 select jsonb_build_object(
 'teams',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'sport',sport,'logo_initials',logo_initials,'logo_path',logo_path)),'[]') from teams),
 'leagues',(select coalesce(jsonb_agg(to_jsonb(l)),'[]') from leagues l where status='active'),
 'fixtures',(select coalesce(jsonb_agg((to_jsonb(f)-'player_details')||jsonb_build_object('player_details',whistle_public_player_details(f.player_details))),'[]') from fixtures f where f.league_id is null or exists(select 1 from leagues l where l.id=f.league_id and l.status='active')),
 'standings',(select coalesce(jsonb_agg(to_jsonb(s)||jsonb_build_object('form',whistle_recent_form(s.league_id,s.team_id)) order by league_id,rank,name),'[]') from standings s where exists(select 1 from leagues l where l.id=s.league_id and l.status='active')),
 'polls',(select coalesce(jsonb_agg(whistle_poll_snapshot(f.id)),'[]') from fixtures f where f.league_id is null or exists(select 1 from leagues l where l.id=f.league_id and l.status='active')))
$$;
create or replace function public.public_fixture(p_fixture_id uuid,p_student_id uuid default null)
returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; squads jsonb:='{}'; v_side text; v_team uuid; players jsonb;
begin
 select * into f from fixtures where id=p_fixture_id;
 if not found or (f.league_id is not null and not exists(select 1 from leagues where id=f.league_id and status='active')) then return null; end if;
 if p_student_id is not null then perform whistle_student(p_student_id); end if;
 foreach v_side in array array['home','away'] loop
  v_team:=case when v_side='home' then f.home_team_id else f.away_team_id end;
  select coalesce(jsonb_agg(jsonb_build_object('name',s.name) order by s.name,s.id),'[]') into players
   from students s where not s.is_admin and
   ((f.league_id is not null and exists(select 1 from league_players lp where lp.league_id=f.league_id and lp.team_id=v_team and lp.student_id=s.id))
    or (f.league_id is null and exists(select 1 from team_players tp where tp.team_id=v_team and tp.student_id=s.id)));
  squads:=squads||jsonb_build_object(v_side,players);
 end loop;
 return jsonb_build_object(
  'fixture',(to_jsonb(f)-'player_details')||jsonb_build_object('player_details',whistle_public_player_details(f.player_details)),
  'teams',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'sport',sport,'logo_initials',logo_initials,'logo_path',logo_path)),'[]') from teams where id in (f.home_team_id,f.away_team_id)),
  'league',(select to_jsonb(l) from leagues l where id=f.league_id),
  'standings',case when f.league_id is not null then admin_standings(f.league_id) else '[]'::jsonb end,
  'squads',squads,'poll',whistle_poll_snapshot(f.id,p_student_id));
end $$;
revoke execute on function public.whistle_recent_form(uuid,uuid),public.admin_standings(uuid),public.public_home(),public.public_fixture(uuid,uuid) from public,anon,authenticated;
grant execute on function public.whistle_recent_form(uuid,uuid),public.admin_standings(uuid),public.public_home(),public.public_fixture(uuid,uuid) to service_role;
notify pgrst, 'reload schema';
commit;
