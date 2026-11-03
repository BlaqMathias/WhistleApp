-- Fictional sports data, using REAL Auth-backed demo accounts.
-- Run scripts/setup-demo.mjs first. No manually invented auth.users/password rows.
-- Runs once, atomically. Initials are used until logos are uploaded through the app.
begin;
select pg_advisory_xact_lock(57545354,4);
do $$
declare
 players uuid[]; ids uuid[]; league uuid; f uuid; fixtures_ids uuid[]; s sport; i integer;
begin
 if exists(select 1 from leagues where name like 'Demo %') then raise exception 'Demo leagues already exist; seed was not applied again.'; end if;
 select array_agg(id order by email) into players from (
  select id,email from students where is_demo and not is_admin order by email limit 4
 ) x;
 if coalesce(cardinality(players),0)<>4 then raise exception 'Run scripts/setup-demo.mjs first: four confirmed demo students are required.'; end if;
 for i in 1..4 loop perform whistle_student(players[i]); end loop;
 foreach s in array array['football'::sport,'basketball'::sport,'volleyball'::sport] loop
  ids:='{}'::uuid[];
  for i in 1..4 loop
   ids:=array_append(ids,admin_save_team(null,(array['Demo Falcons','Demo Ravens','Demo Lions','Demo Titans'])[i],s,array[players[i]]));
  end loop;
  league:=admin_create_league('Demo '||initcap(s::text)||' League',s,'Demo season',ids,case when s='volleyball' then 3 end);
  select array_agg(id order by round_number,home_name,away_name) into fixtures_ids from fixtures where league_id=league;
  for i in 1..cardinality(fixtures_ids) loop
   perform admin_reschedule(fixtures_ids[i],now()+interval '2 days'+make_interval(hours=>i),'Demo campus '||case when s='football' then 'pitch' else 'court' end);
  end loop;
  f:=fixtures_ids[1];
  if s='football' then
   perform student_vote(f,players[1],'win_home'); perform student_vote(f,players[2],'win_away'); perform student_vote(f,players[3],'draw');
   perform admin_start(f); perform admin_score(f,'home',1); perform admin_end(f);
  elsif s='basketball' then
   perform student_vote(f,players[1],'win_home'); perform student_vote(f,players[2],'draw');
   perform admin_start(f); perform admin_score(f,'home',3); perform admin_score(f,'away',3); perform admin_end(f);
   perform student_vote(fixtures_ids[2],players[4],'win_away'); perform admin_start(fixtures_ids[2]);
   perform admin_score(fixtures_ids[2],'home',2);
  else
   perform student_vote(f,players[1],'win_home'); perform student_vote(f,players[2],'win_away'); perform student_vote(f,players[4],'win_away');
   perform admin_start(f); perform admin_end(f); perform admin_record_result(f,2,1);
  end if;
  perform student_vote(fixtures_ids[3],players[1],'win_home'); perform admin_walkover(fixtures_ids[3],'away');
  perform student_vote(fixtures_ids[4],players[3],'win_away'); perform admin_start(fixtures_ids[4]);
  perform admin_cancel(fixtures_ids[4],'Demo cancellation: match abandoned; no standings or Ws impact.');
 end loop;
 -- Fully temporary teams, no registered roster required for a Friendly.
 f:=admin_create_friendly('football',p_home_name=>'Demo Visitors A',p_away_name=>'Demo Visitors B',p_venue=>'Demo training pitch');
 perform student_vote(f,players[3],'draw');
 -- Choosing Save team requires at least one registered player.
 f:=admin_create_friendly('football',p_home_name=>'Demo Harriers',p_away_name=>'Demo Guests',p_save_home=>true,
   p_home_student_ids=>array[players[1]],p_scheduled_at=>now()+interval '5 days',p_venue=>'Demo campus pitch');
 f:=admin_create_friendly('volleyball',p_home_name=>'Demo Staff Six',p_away_name=>'Demo Alumni Six',p_best_of=>5,
   p_scheduled_at=>now()+interval '4 days',p_venue=>'Demo indoor court');
 perform student_submit_feedback(gen_random_uuid(),players[1],'suggestion','Demo suggestion: show the venue clearly beside each fixture.');
 perform student_submit_feedback(gen_random_uuid(),players[2],'bug','Demo bug report for checking the review queue.');
 perform student_submit_feedback(gen_random_uuid(),players[3],'complaint','Demo complaint for checking the review queue.');
 perform student_set_notifications(players[4],false);
end $$;
commit;

select 'teams' kind,count(*) n from public.teams
union all select 'leagues',count(*) from public.leagues
union all select 'league fixtures',count(*) from public.fixtures where league_id is not null
union all select 'friendlies',count(*) from public.fixtures where league_id is null;
select rank,name,ws,predictions,correct from public.ws_leaderboard order by rank,name;
