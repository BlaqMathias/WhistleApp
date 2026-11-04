-- Existing installations: own prediction history; preserves fixtures, votes and Ws.
begin;
create or replace function public.whistle_poll_snapshot(p_fixture_id uuid,p_student_id uuid default null) returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; p polls;
begin
 select * into f from fixtures where id=p_fixture_id;
 if not found or (f.league_id is not null and not exists(select 1 from leagues where id=f.league_id and status='active') and not exists(select 1 from poll_votes hv join polls hp on hp.id=hv.poll_id where hp.fixture_id=f.id and hv.student_id=p_student_id)) then raise exception 'Fixture not found.'; end if;
 select * into strict p from polls where fixture_id=f.id;
 return jsonb_build_object('fixture_id',f.id,'status',p.status,'can_vote',p.status='open' and f.status='scheduled',
 'my_choice',(select choice from poll_votes where poll_id=p.id and student_id=p_student_id),
 'my_ws',(select delta from ws_ledger where fixture_id=f.id and student_id=p_student_id),
 'total',(select count(*) from poll_votes where poll_id=p.id),
 'tally',jsonb_build_object('win_home',(select count(*) from poll_votes where poll_id=p.id and choice='win_home'),
 'draw',(select count(*) from poll_votes where poll_id=p.id and choice='draw'),
 'win_away',(select count(*) from poll_votes where poll_id=p.id and choice='win_away')));
end $$;
create or replace function public.public_fixture(p_fixture_id uuid,p_student_id uuid default null)
returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; squads jsonb:='{}'; v_side text; v_team uuid; players jsonb;
begin
 select * into f from fixtures where id=p_fixture_id;
 if not found or (f.league_id is not null and not exists(select 1 from leagues where id=f.league_id and status='active') and not exists(select 1 from poll_votes hv join polls hp on hp.id=hv.poll_id where hp.fixture_id=f.id and hv.student_id=p_student_id)) then return null; end if;
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
create index if not exists poll_votes_student_history on public.poll_votes(student_id,updated_at desc,id);
create or replace function public.student_prediction_history(p_student_id uuid) returns jsonb language plpgsql set search_path=public as $$
begin
 perform whistle_student(p_student_id);
 return jsonb_build_object(
  'entries',(select coalesce(jsonb_agg(jsonb_build_object(
   'fixture',(to_jsonb(f)-'player_details')||jsonb_build_object('player_details',whistle_public_player_details(f.player_details)),
   'choice',v.choice,'ws',w.delta,'poll_status',p.status,'predicted_at',v.updated_at
  ) order by v.updated_at desc,v.id),'[]') from poll_votes v join polls p on p.id=v.poll_id join fixtures f on f.id=p.fixture_id left join ws_ledger w on w.vote_id=v.id where v.student_id=p_student_id),
  'teams',(select coalesce(jsonb_agg(jsonb_build_object('id',t.id,'name',t.name,'sport',t.sport,'logo_initials',t.logo_initials,'logo_path',t.logo_path)),'[]') from teams t where exists(select 1 from poll_votes v join polls p on p.id=v.poll_id join fixtures f on f.id=p.fixture_id where v.student_id=p_student_id and t.id in(f.home_team_id,f.away_team_id))),
  'leagues',(select coalesce(jsonb_agg(to_jsonb(l)),'[]') from leagues l where exists(select 1 from poll_votes v join polls p on p.id=v.poll_id join fixtures f on f.id=p.fixture_id where v.student_id=p_student_id and f.league_id=l.id))
 );
end $$;
revoke execute on function public.student_prediction_history(uuid),public.whistle_poll_snapshot(uuid,uuid),public.public_fixture(uuid,uuid) from public,anon,authenticated;
grant execute on function public.student_prediction_history(uuid),public.whistle_poll_snapshot(uuid,uuid),public.public_fixture(uuid,uuid) to service_role;
notify pgrst, 'reload schema';
commit;
