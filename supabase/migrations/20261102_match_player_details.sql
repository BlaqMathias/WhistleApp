-- Existing Whistle v2 database: run this whole file once in Supabase SQL Editor.
-- Safe to rerun. Retains accounts, fixtures, standings, predictions and Ws.
begin;

alter table public.fixtures add column if not exists player_details jsonb not null
 default '{"man_of_the_match":null,"goals":[]}'::jsonb;

-- Registered teams use roster identities; temporary Friendly sides use names only.
-- Store a name snapshot so later roster/name changes do not rewrite match history.
create or replace function public.whistle_match_player(p_fixture_id uuid,p_player jsonb)
returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; v_side text; v_team uuid; v_student uuid; v_name text;
begin
 if p_player is null or p_player='null'::jsonb then return null; end if;
 if jsonb_typeof(p_player)<>'object' then raise exception 'Choose a match player.'; end if;
 select * into strict f from fixtures where id=p_fixture_id;
 v_side:=p_player->>'side';
 if v_side is null or v_side not in ('home','away') then raise exception 'Choose the player team.'; end if;
 v_team:=case when v_side='home' then f.home_team_id else f.away_team_id end;
 if v_team is null then
  if p_player->>'student_id' is not null then raise exception 'Use a match-only name for a temporary Friendly team.'; end if;
  if jsonb_typeof(p_player->'name') is distinct from 'string' then raise exception 'Enter the player name.'; end if;
  v_name:=trim(p_player->>'name');
  if length(v_name) not between 1 and 120 then raise exception 'Player names must contain 1 to 120 characters.'; end if;
 else
  v_student:=(p_player->>'student_id')::uuid;
  perform whistle_student(v_student);
  if (f.league_id is not null and not exists(select 1 from league_players where league_id=f.league_id and team_id=v_team and student_id=v_student))
    or (f.league_id is null and not exists(select 1 from team_players where team_id=v_team and student_id=v_student)) then
   raise exception 'Choose a player from this team roster.';
  end if;
  select name into strict v_name from students where id=v_student;
 end if;
 return jsonb_build_object('side',v_side,'student_id',v_student,'name',v_name);
end $$;

create or replace function public.whistle_validate_player_details(p_fixture_id uuid,p_details jsonb)
returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; motm jsonb; goals jsonb; g jsonb; scorer jsonb; assist jsonb;
 result jsonb:='[]'; v_side text; home_count integer:=0; away_count integer:=0;
begin
 select * into strict f from fixtures where id=p_fixture_id;
 if p_details is null or jsonb_typeof(p_details)<>'object' then raise exception 'Enter valid match player details.'; end if;
 motm:=whistle_match_player(f.id,p_details->'man_of_the_match');
 goals:=coalesce(p_details->'goals','[]'::jsonb);
 if jsonb_typeof(goals)<>'array' then raise exception 'Goals must be a list.'; end if;
 if jsonb_array_length(goals)>100 then raise exception 'Record at most 100 goal entries.'; end if;
 if f.sport<>'football' and jsonb_array_length(goals)>0 then raise exception 'Only Football records scorers and assists.'; end if;
 for g in select value from jsonb_array_elements(goals) loop
  if jsonb_typeof(g)<>'object' then raise exception 'Enter a valid goal entry.'; end if;
  v_side:=g->>'side';
  if v_side is null or v_side not in ('home','away') then raise exception 'Choose the scoring team.'; end if;
  scorer:=whistle_match_player(f.id,g->'scorer');
  assist:=whistle_match_player(f.id,g->'assist');
  if scorer is null and assist is null then raise exception 'Choose a scorer or an assist, or remove the empty goal entry.'; end if;
  if (scorer is not null and scorer->>'side'<>v_side) or (assist is not null and assist->>'side'<>v_side) then
   raise exception 'Scorer and assist must belong to the scoring team.';
  end if;
  if scorer is not null and assist is not null and
    ((scorer->>'student_id' is not null and scorer->>'student_id'=assist->>'student_id')
     or (scorer->>'student_id' is null and lower(scorer->>'name')=lower(assist->>'name'))) then
   raise exception 'A player cannot assist their own goal.';
  end if;
  if v_side='home' then home_count:=home_count+1; else away_count:=away_count+1; end if;
  result:=result||jsonb_build_array(jsonb_build_object('side',v_side,'scorer',scorer,'assist',assist));
 end loop;
 if home_count>coalesce(f.home_score,0) or away_count>coalesce(f.away_score,0) then
  raise exception 'Record the team score first. Goal entries cannot exceed that team score.';
 end if;
 return jsonb_build_object('man_of_the_match',motm,'goals',result);
end $$;

create or replace function public.whistle_player_details_guard() returns trigger
language plpgsql set search_path=public as $$
begin
 if new.player_details is not distinct from old.player_details then return new; end if;
 if old.status<>'live' or old.ended_at is not null then
  raise exception 'Player details can only be set during play, before End Match.';
 end if;
 new.player_details:=whistle_validate_player_details(old.id,new.player_details);
 return new;
end $$;
drop trigger if exists fixture_player_details_guard on public.fixtures;
create trigger fixture_player_details_guard before update of player_details on public.fixtures
 for each row execute function public.whistle_player_details_guard();

create or replace function public.admin_save_player_details(p_fixture_id uuid,p_details jsonb)
returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; details jsonb;
begin
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status<>'live' or f.ended_at is not null then
  raise exception 'Player details can only be set during play, before End Match.';
 end if;
 details:=whistle_validate_player_details(f.id,p_details);
 update fixtures set player_details=details where id=f.id;
 return details;
end $$;

-- One transaction saves optional entries and ends the match. Neither can race
-- another End/score request or succeed alone if the submitted details are invalid.
create or replace function public.admin_end_with_players(p_fixture_id uuid,p_details jsonb)
returns jsonb language plpgsql set search_path=public as $$
begin
 perform admin_save_player_details(p_fixture_id,p_details);
 return admin_end(p_fixture_id);
end $$;

-- Public/student fixtures expose display names, never roster IDs or account data.
create or replace function public.whistle_public_player_details(p_details jsonb)
returns jsonb language sql immutable set search_path=public as $$
 select jsonb_build_object(
  'man_of_the_match',case when p_details->'man_of_the_match' is null or p_details->'man_of_the_match'='null'::jsonb then null
    else (p_details->'man_of_the_match')-'student_id' end,
  'goals',(select coalesce(jsonb_agg(jsonb_build_object('side',g->>'side',
    'scorer',case when g->'scorer'='null'::jsonb then null else (g->'scorer')-'student_id' end,
    'assist',case when g->'assist'='null'::jsonb then null else (g->'assist')-'student_id' end) order by n),'[]'::jsonb)
    from jsonb_array_elements(coalesce(p_details->'goals','[]'::jsonb)) with ordinality x(g,n)))
$$;
create or replace function public.public_home() returns jsonb language sql set search_path=public as $$
 select jsonb_build_object(
 'teams',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'sport',sport,'logo_initials',logo_initials,'logo_path',logo_path)),'[]') from teams),
 'leagues',(select coalesce(jsonb_agg(to_jsonb(l)),'[]') from leagues l where status='active'),
 'fixtures',(select coalesce(jsonb_agg((to_jsonb(f)-'player_details')||jsonb_build_object('player_details',whistle_public_player_details(f.player_details))),'[]') from fixtures f where f.league_id is null or exists(select 1 from leagues l where l.id=f.league_id and l.status='active')),
 'standings',(select coalesce(jsonb_agg(to_jsonb(s) order by league_id,rank,name),'[]') from standings s where exists(select 1 from leagues l where l.id=s.league_id and l.status='active')),
 'polls',(select coalesce(jsonb_agg(whistle_poll_snapshot(f.id)),'[]') from fixtures f where f.league_id is null or exists(select 1 from leagues l where l.id=f.league_id and l.status='active')))
$$;

revoke execute on function public.whistle_match_player(uuid,jsonb),public.whistle_validate_player_details(uuid,jsonb),
 public.whistle_player_details_guard(),public.admin_save_player_details(uuid,jsonb),public.admin_end_with_players(uuid,jsonb),
 public.whistle_public_player_details(jsonb),public.public_home() from public,anon,authenticated;
grant execute on function public.whistle_match_player(uuid,jsonb),public.whistle_validate_player_details(uuid,jsonb),
 public.whistle_player_details_guard(),public.admin_save_player_details(uuid,jsonb),public.admin_end_with_players(uuid,jsonb),
 public.whistle_public_player_details(jsonb),public.public_home() to service_role;
notify pgrst, 'reload schema';
commit;
