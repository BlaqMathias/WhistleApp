-- Optional sample for an existing Whistle database; uses only confirmed is_demo students.
-- Run AFTER the latest schema/migrations. Does not change any existing match.
-- Safe to rerun: skips the sample when already present.
begin;
select pg_advisory_xact_lock(57545354,4);
do $$
declare players uuid[]; h uuid; a uuid; f uuid; i integer;
begin
 if exists(select 1 from fixtures where sport='football' and league_id is null
   and home_name='Demo Goal Makers' and away_name='Demo Playmakers') then
  raise notice 'Demo scorer/assist fixture already exists; left unchanged.';
  return;
 end if;
 select array_agg(id order by email) into players from (
  select id,email from students where is_demo and not is_admin order by email limit 4
 ) x;
 if coalesce(cardinality(players),0)<>4 then
  raise exception 'Run scripts/setup-demo.mjs first: four confirmed demo students are required.';
 end if;
 for i in 1..4 loop perform whistle_student(players[i]); end loop;
 h:=admin_save_team(null,'Demo Goal Makers','football',array[players[1],players[2]]);
 a:=admin_save_team(null,'Demo Playmakers','football',array[players[3],players[4]]);
 f:=admin_create_friendly('football',p_home_team_id=>h,p_away_team_id=>a,p_venue=>'Demo training pitch');
 perform admin_start(f);
 for i in 1..3 loop perform admin_score(f,'home',1); end loop;
 perform admin_score(f,'away',1);
 perform admin_end_with_players(f,jsonb_build_object(
  'man_of_the_match',jsonb_build_object('side','home','student_id',players[1]),
  'goals',jsonb_build_array(
   jsonb_build_object('side','home','scorer',jsonb_build_object('side','home','student_id',players[1]),'assist',jsonb_build_object('side','home','student_id',players[2])),
   jsonb_build_object('side','home','scorer',jsonb_build_object('side','home','student_id',players[1]),'assist',jsonb_build_object('side','home','student_id',players[2])),
   jsonb_build_object('side','home','scorer',jsonb_build_object('side','home','student_id',players[2]),'assist',jsonb_build_object('side','home','student_id',players[1])),
   jsonb_build_object('side','away','scorer',jsonb_build_object('side','away','student_id',players[3]),'assist',jsonb_build_object('side','away','student_id',players[4]))
  )));
end $$;
commit;
select id,home_name,away_name,home_score,away_score,status from public.fixtures
 where sport='football' and league_id is null and home_name='Demo Goal Makers' and away_name='Demo Playmakers';

