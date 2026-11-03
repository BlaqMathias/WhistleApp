-- Whistle rebuild v2. Install once in the new, empty Supabase project.
-- All timestamps are timestamptz (UTC); format as Africa/Lagos in the UI.
-- There are no Fests, payments, Cups, event umbrella, or automatic live worker.
-- RPC contract: service-role-only; Next.js MUST authorize the session/role first.
begin;
create type public.sport as enum ('football','basketball','volleyball');
create type public.archive_status as enum ('active','archived');
create type public.fixture_status as enum ('scheduled','live','completed','walkover','cancelled');
create type public.poll_status as enum ('open','closed','void');
create type public.poll_choice as enum ('win_home','draw','win_away');
create type public.feedback_category as enum ('suggestion','complaint','bug');
create type public.feedback_status as enum ('new','reviewed','resolved');

create table public.students (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid not null unique references auth.users(id),
 name text not null check(length(trim(name)) between 1 and 120),
 email text not null unique check(email=lower(trim(email)) and email ~ '^[^@[:space:]]+@topfaith\.edu\.ng$'),
 matric_number text not null,
 faculty text not null check(faculty in ('MASS','COMPASS','Law/Nomos','RAPHA','Engineering')),
 is_admin boolean not null default false,
 is_demo boolean not null default false,
 notifications_enabled boolean not null default true,
 created_at timestamptz not null default now()
);
create unique index students_single_admin on public.students(is_admin) where is_admin;
create table public.teams (
 id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name)) between 1 and 120),
 sport public.sport not null, logo_initials text not null, logo_path text,
 status public.archive_status not null default 'active', created_at timestamptz not null default now()
);
create unique index team_name_per_sport on public.teams(sport,lower(trim(name)));
create table public.team_players (
 id uuid primary key default gen_random_uuid(), team_id uuid not null references public.teams(id),
 student_id uuid not null references public.students(id), unique(team_id,student_id)
);
create table public.leagues (
 id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name)) between 1 and 160),
 sport public.sport not null, season text not null check(length(trim(season)) between 1 and 80),
 best_of integer, status public.archive_status not null default 'active',
 generated_at timestamptz, created_at timestamptz not null default now(),
 check((sport='volleyball' and best_of is not null and best_of in (3,5)) or (sport<>'volleyball' and best_of is null))
);
create table public.league_teams (
 league_id uuid not null references public.leagues(id), team_id uuid not null references public.teams(id),
 primary key(league_id,team_id)
);
-- League membership is explicit, so a later season does not overwrite history.
create table public.league_players (
 league_id uuid not null, team_id uuid not null, student_id uuid not null references public.students(id),
 primary key(league_id,student_id),
 foreign key(league_id,team_id) references public.league_teams(league_id,team_id) on delete cascade
);
create table public.fixtures (
 id uuid primary key default gen_random_uuid(), league_id uuid references public.leagues(id),
 sport public.sport not null, best_of integer,
 home_team_id uuid references public.teams(id), away_team_id uuid references public.teams(id),
 home_name text not null check(length(trim(home_name)) between 1 and 120),
 away_name text not null check(length(trim(away_name)) between 1 and 120),
 home_initials text not null, away_initials text not null, home_logo_path text, away_logo_path text,
 origin text not null default 'manual' check(origin in ('automatic','manual')),
 round_number integer check(round_number>0),
 scheduled_at timestamptz, venue text check(venue is null or length(trim(venue)) between 1 and 200),
 status public.fixture_status not null default 'scheduled', started_at timestamptz, ended_at timestamptz,
 home_score integer check(home_score>=0), away_score integer check(away_score>=0),
 home_sets integer check(home_sets>=0), away_sets integer check(away_sets>=0),
 winner_side text check(winner_side in ('home','away')), cancellation_reason text,
 settlement_revision integer not null default 0, created_at timestamptz not null default now(),
 foreign key(league_id,home_team_id) references public.league_teams(league_id,team_id),
 foreign key(league_id,away_team_id) references public.league_teams(league_id,team_id),
 check(league_id is null or (home_team_id is not null and away_team_id is not null)),
 check(home_team_id is null or away_team_id is null or home_team_id<>away_team_id),
 check(lower(trim(home_name))<>lower(trim(away_name))),
 check((sport='volleyball' and best_of is not null and best_of in (3,5) and home_score is null and away_score is null)
    or (sport<>'volleyball' and best_of is null and home_sets is null and away_sets is null)),
 check(status<>'live' or started_at is not null),
 check(status<>'completed' or (started_at is not null and ended_at is not null)),
 check(status<>'walkover' or (winner_side is not null and home_score is null and away_score is null and home_sets is null and away_sets is null))
);
-- One automatically generated home leg and away leg; manual extra fixtures are allowed.
create unique index automatic_pair_once on public.fixtures(league_id,home_team_id,away_team_id)
 where origin='automatic' and league_id is not null;
create index fixtures_schedule on public.fixtures(status,scheduled_at);
create index fixtures_league on public.fixtures(league_id,status);
create table public.polls (
 id uuid primary key default gen_random_uuid(), fixture_id uuid not null unique references public.fixtures(id) on delete cascade,
 status public.poll_status not null default 'open', created_at timestamptz not null default now()
);
create table public.poll_votes (
 id uuid primary key default gen_random_uuid(), poll_id uuid not null references public.polls(id) on delete cascade,
 student_id uuid not null references public.students(id), choice public.poll_choice not null,
 updated_at timestamptz not null default now(), unique(poll_id,student_id)
);
-- One current settlement per vote, not a mutable wallet. Corrections replace its
-- delta; summing gives exactly the old reversal + new award, without double credit.
create table public.ws_ledger (
 vote_id uuid primary key references public.poll_votes(id) on delete cascade,
 fixture_id uuid not null references public.fixtures(id), student_id uuid not null references public.students(id),
 delta integer not null check(delta in (50,-25)), revision integer not null,
 settled_at timestamptz not null default now(), unique(fixture_id,student_id)
);
create index ws_student on public.ws_ledger(student_id);
create table public.notifications (
 id uuid primary key default gen_random_uuid(), student_id uuid not null references public.students(id),
 type text not null check(type in ('live_score','new_league','new_friendly')),
 message text not null, read boolean not null default false, created_at timestamptz not null default now()
);
create index notification_feed on public.notifications(student_id,created_at desc,id);
create table public.feedback (
 id uuid primary key, student_id uuid not null references public.students(id),
 category public.feedback_category not null, message text not null check(length(trim(message)) between 1 and 5000),
 status public.feedback_status not null default 'new', created_at timestamptz not null default now()
);

create function public.whistle_initials(p_name text) returns text
language sql immutable set search_path=public as $$
 select string_agg(left(word,1),'' order by n) from regexp_split_to_table(upper(trim(p_name)),'\s+') with ordinality t(word,n) where n<=3
$$;
create function public.whistle_notify(p_type text,p_message text) returns void
language sql set search_path=public as $$
 insert into notifications(student_id,type,message) select id,p_type,p_message from students where not is_admin and notifications_enabled
$$;
create function public.whistle_student(p_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.students s join auth.users u on u.id=s.auth_user_id
   where s.id=p_id and not s.is_admin and u.email_confirmed_at is not null
   and u.email ~* '^[^@[:space:]]+@topfaith\.edu\.ng$') then
  raise exception 'A confirmed, registered Whistle student is required.';
 end if;
end $$;
create function public.whistle_signup_profile() returns trigger language plpgsql security definer set search_path='' as $$
declare v_name text; v_faculty text;
begin
 if new.email is null or new.email !~* '^[^@[:space:]]+@topfaith\.edu\.ng$' then raise exception 'Use your @topfaith.edu.ng account.'; end if;
 if exists(select 1 from public.students where auth_user_id=new.id) then
  update public.students set email=lower(new.email),matric_number=split_part(lower(new.email),'@',1) where auth_user_id=new.id;
  return new;
 end if;
 v_name:=trim(new.raw_user_meta_data->>'name'); v_faculty:=new.raw_user_meta_data->>'faculty';
 if v_name is null or length(v_name) not between 1 and 120 then raise exception 'Enter your full name.'; end if;
 if v_faculty is null or v_faculty not in ('MASS','COMPASS','Law/Nomos','RAPHA','Engineering') then raise exception 'Select your faculty.'; end if;
 if new.email_confirmed_at is not null then
  insert into public.students(auth_user_id,name,email,matric_number,faculty)
   values(new.id,v_name,lower(new.email),split_part(lower(new.email),'@',1),v_faculty);
 end if;
 return new;
end $$;
create trigger whistle_student_signup after insert or update of email,email_confirmed_at on auth.users
 for each row execute function public.whistle_signup_profile();
create function public.admin_bootstrap(p_auth_user_id uuid) returns uuid language plpgsql set search_path=public as $$
declare v_id uuid;
begin
 perform pg_advisory_xact_lock(57545354,3);
 if exists(select 1 from students where is_admin and auth_user_id<>p_auth_user_id) then raise exception 'The single administrator already exists.'; end if;
 update students set is_admin=true where auth_user_id=p_auth_user_id returning id into v_id;
 if v_id is null then raise exception 'Create and confirm this campus Auth account first.'; end if;
 return v_id;
end $$;

create function public.whistle_fixture_guard() returns trigger language plpgsql set search_path=public as $$
declare l leagues; t teams; target integer;
begin
 if tg_op='DELETE' then
  if old.status<>'scheduled' or old.started_at is not null or old.home_score is not null or old.away_score is not null
    or old.home_sets is not null or old.away_sets is not null or old.winner_side is not null
    or exists(select 1 from ws_ledger where fixture_id=old.id) then
   raise exception 'This fixture is protected. Cancel an unfinished match or correct its result.';
  end if;
  return old;
 end if;
 if tg_op='UPDATE' then
  if old.started_at is not null and new.started_at is distinct from old.started_at then raise exception 'The original kickoff cannot be reset.'; end if;
  if old.status<>'scheduled' and (new.league_id is distinct from old.league_id or new.sport<>old.sport
    or new.best_of is distinct from old.best_of or new.home_team_id is distinct from old.home_team_id
    or new.away_team_id is distinct from old.away_team_id or new.home_name<>old.home_name or new.away_name<>old.away_name
    or new.scheduled_at is distinct from old.scheduled_at or new.venue is distinct from old.venue) then
   raise exception 'Participants and schedule are locked after this match leaves Scheduled.';
  end if;
  if (old.status in ('completed','walkover','cancelled') and new.status<>old.status)
     or (old.status='live' and new.status='scheduled') then raise exception 'This match cannot return to an earlier state.'; end if;
 end if;
 if new.league_id is not null then
  select * into strict l from leagues where id=new.league_id;
  if new.sport<>l.sport or new.best_of is distinct from l.best_of then raise exception 'Fixture format must match its league.'; end if;
 end if;
 if new.home_team_id is not null then
  select * into strict t from teams where id=new.home_team_id;
  if t.sport<>new.sport then raise exception 'Home team sport mismatch.'; end if;
 end if;
 if new.away_team_id is not null then
  select * into strict t from teams where id=new.away_team_id;
  if t.sport<>new.sport then raise exception 'Away team sport mismatch.'; end if;
 end if;
 if new.status='completed' then
  if new.sport='volleyball' then
   target:=(new.best_of+1)/2;
   if new.home_sets is null or new.away_sets is null
     or not ((new.home_sets=target and new.away_sets between 0 and target-1)
       or (new.away_sets=target and new.home_sets between 0 and target-1))
     or new.winner_side is distinct from (case when new.home_sets>new.away_sets then 'home' else 'away' end) then
    raise exception 'Enter a complete, valid set score for this best-of format.';
   end if;
  else
   if new.home_score is null or new.away_score is null
     or new.winner_side is distinct from (case when new.home_score>new.away_score then 'home' when new.away_score>new.home_score then 'away' else null end) then
    raise exception 'Final scores and winner must agree.';
   end if;
  end if;
 end if;
 return new;
end $$;
create trigger fixture_guard before insert or update or delete on public.fixtures
 for each row execute function public.whistle_fixture_guard();
create function public.whistle_open_poll() returns trigger language plpgsql set search_path=public as $$
begin insert into polls(fixture_id,status) values(new.id,'open'); return new; end $$;
create trigger fixture_open_poll after insert on public.fixtures for each row execute function public.whistle_open_poll();

create function public.admin_save_team(p_id uuid,p_name text,p_sport sport,p_student_ids uuid[]) returns uuid language plpgsql set search_path=public as $$
declare v_id uuid; t teams; s uuid; l uuid;
begin
 if p_name is null or length(trim(p_name)) not between 1 and 120 then raise exception 'Enter a team name.'; end if;
 if p_student_ids is null or cardinality(p_student_ids)<1 or array_position(p_student_ids,null) is not null
   or (select count(distinct x) from unnest(p_student_ids) x)<>cardinality(p_student_ids) then raise exception 'Choose at least one distinct registered player.'; end if;
 for s in select unnest(p_student_ids) loop perform whistle_student(s); end loop;
 if p_id is null then
  insert into teams(name,sport,logo_initials) values(trim(p_name),p_sport,whistle_initials(p_name)) returning id into v_id;
 else
  select * into t from teams where id=p_id for update;
  if not found or t.status<>'active' then raise exception 'Active team not found.'; end if;
  if t.sport<>p_sport then raise exception 'A team sport cannot change.'; end if;
  v_id:=p_id;
  for l in select lt.league_id from league_teams lt join leagues x on x.id=lt.league_id where lt.team_id=v_id and x.status='active' order by lt.league_id loop
   perform id from leagues where id=l for update;
   if exists(select 1 from league_players where league_id=l and team_id<>v_id and student_id=any(p_student_ids)) then
    raise exception 'A player already represents another team in this league.';
   end if;
   delete from league_players where league_id=l and team_id=v_id;
   insert into league_players(league_id,team_id,student_id) select l,v_id,x from unnest(p_student_ids) x;
  end loop;
  update teams set name=trim(p_name),logo_initials=whistle_initials(p_name) where id=v_id;
  delete from team_players where team_id=v_id;
 end if;
 insert into team_players(team_id,student_id) select v_id,x from unnest(p_student_ids) x;
 return v_id;
end $$;
create function public.whistle_enrol(p_league_id uuid,p_team_id uuid) returns void language plpgsql set search_path=public as $$
declare l leagues; t teams; s uuid;
begin
 select * into l from leagues where id=p_league_id for update;
 select * into t from teams where id=p_team_id for share;
 if l.id is null or l.status<>'active' or t.id is null or t.status<>'active' or t.sport<>l.sport then raise exception 'Choose an active team from this league sport.'; end if;
 if not exists(select 1 from team_players where team_id=t.id) then raise exception 'The team needs at least one registered player.'; end if;
 for s in select student_id from team_players where team_id=t.id loop perform whistle_student(s); end loop;
 if exists(select 1 from league_players where league_id=l.id and team_id<>t.id and student_id in(select student_id from team_players where team_id=t.id)) then
  raise exception 'A player can represent only one team in each league.';
 end if;
 insert into league_teams values(l.id,t.id);
 insert into league_players select l.id,t.id,student_id from team_players where team_id=t.id;
end $$;
create function public.whistle_insert_fixture(p_league_id uuid,p_home uuid,p_away uuid,p_round integer default null,p_origin text default 'manual') returns uuid language plpgsql set search_path=public as $$
declare l leagues; h teams; a teams; v_id uuid;
begin
 select * into strict l from leagues where id=p_league_id;
 select * into strict h from teams where id=p_home; select * into strict a from teams where id=p_away;
 if l.status<>'active' or h.status<>'active' or a.status<>'active' then raise exception 'Choose an active league and active teams.'; end if;
 insert into fixtures(league_id,sport,best_of,home_team_id,away_team_id,home_name,away_name,home_initials,away_initials,round_number,origin)
 values(l.id,l.sport,l.best_of,h.id,a.id,h.name,a.name,h.logo_initials,a.logo_initials,p_round,p_origin) returning id into v_id;
 return v_id;
end $$;
create function public.admin_generate_fixtures(p_league_id uuid) returns integer language plpgsql set search_path=public as $$
declare l leagues; ring uuid[]; n integer; r integer; i integer; h uuid; a uuid; last_id uuid; v_count integer:=0;
begin
 select * into l from leagues where id=p_league_id for update;
 if not found or l.status<>'active' then raise exception 'Active league not found.'; end if;
 if l.generated_at is not null then return (select count(*)::integer from fixtures where league_id=l.id); end if;
 select array_agg(team_id order by team_id) into ring from league_teams where league_id=l.id;
 n:=coalesce(cardinality(ring),0); if n<2 then raise exception 'A league requires at least two teams.'; end if;
 if n%2=1 then ring:=array_append(ring,null::uuid); n:=n+1; end if;
 for r in 0..n-2 loop
  for i in 1..n/2 loop
   h:=ring[i]; a:=ring[n+1-i];
   if h is not null and a is not null then
    if r%2=1 then h:=ring[n+1-i]; a:=ring[i]; end if;
    perform whistle_insert_fixture(l.id,h,a,r+1,'automatic');
    perform whistle_insert_fixture(l.id,a,h,r+n,'automatic'); v_count:=v_count+2;
   end if;
  end loop;
  last_id:=ring[n]; ring:=array[ring[1],last_id]||ring[2:n-1];
 end loop;
 update leagues set generated_at=now() where id=l.id; return v_count;
end $$;
create function public.admin_create_league(p_name text,p_sport sport,p_season text,p_team_ids uuid[],p_best_of integer default null) returns uuid language plpgsql set search_path=public as $$
declare v_id uuid; t uuid;
begin
 if p_team_ids is null or cardinality(p_team_ids)<2 or array_position(p_team_ids,null) is not null
  or (select count(distinct x) from unnest(p_team_ids) x)<>cardinality(p_team_ids) then raise exception 'Choose at least two distinct teams.'; end if;
 insert into leagues(name,sport,season,best_of) values(trim(p_name),p_sport,trim(p_season),p_best_of) returning id into v_id;
 for t in select unnest(p_team_ids) loop perform whistle_enrol(v_id,t); end loop;
 perform admin_generate_fixtures(v_id); perform whistle_notify('new_league','New league: '||trim(p_name)); return v_id;
end $$;
create function public.admin_add_league_team(p_league_id uuid,p_team_id uuid) returns void language plpgsql set search_path=public as $$
declare t uuid;
begin
 perform whistle_enrol(p_league_id,p_team_id);
 for t in select team_id from league_teams where league_id=p_league_id and team_id<>p_team_id loop
  perform whistle_insert_fixture(p_league_id,p_team_id,t,null,'automatic');
  perform whistle_insert_fixture(p_league_id,t,p_team_id,null,'automatic');
 end loop;
end $$;
create function public.admin_add_fixture(p_league_id uuid,p_home uuid,p_away uuid) returns uuid language plpgsql set search_path=public as $$
begin perform id from leagues where id=p_league_id for update; return whistle_insert_fixture(p_league_id,p_home,p_away); end $$;
create function public.admin_create_friendly(
 p_sport sport,p_home_team_id uuid default null,p_away_team_id uuid default null,
 p_home_name text default null,p_away_name text default null,
 p_save_home boolean default false,p_save_away boolean default false,
 p_home_student_ids uuid[] default null,p_away_student_ids uuid[] default null,
 p_best_of integer default null,p_scheduled_at timestamptz default null,p_venue text default null
) returns uuid language plpgsql set search_path=public as $$
declare h uuid:=p_home_team_id; a uuid:=p_away_team_id; hn text:=trim(p_home_name); an text:=trim(p_away_name); v_id uuid;
begin
 if h is not null then
  select name into hn from teams where id=h and sport=p_sport and status='active';
  if not found then raise exception 'Active home team not found for this sport.'; end if;
 elsif p_save_home then h:=admin_save_team(null,hn,p_sport,p_home_student_ids); end if;
 if a is not null then
  select name into an from teams where id=a and sport=p_sport and status='active';
  if not found then raise exception 'Active away team not found for this sport.'; end if;
 elsif p_save_away then a:=admin_save_team(null,an,p_sport,p_away_student_ids); end if;
 insert into fixtures(sport,best_of,home_team_id,away_team_id,home_name,away_name,home_initials,away_initials,scheduled_at,venue)
 values(p_sport,p_best_of,h,a,hn,an,whistle_initials(hn),whistle_initials(an),p_scheduled_at,nullif(trim(p_venue),'')) returning id into v_id;
 perform whistle_notify('new_friendly','New Friendly: '||hn||' vs '||an); return v_id;
end $$;

create function public.admin_reschedule(p_fixture_id uuid,p_scheduled_at timestamptz,p_venue text) returns void language plpgsql set search_path=public as $$
begin
 update fixtures f set scheduled_at=p_scheduled_at,venue=nullif(trim(p_venue),'') where id=p_fixture_id and status='scheduled'
  and (f.league_id is null or exists(select 1 from leagues l where l.id=f.league_id and l.status='active'));
 if not found then raise exception 'Only an unstarted fixture can be rescheduled.'; end if;
end $$;
create function public.admin_start(p_fixture_id uuid) returns void language plpgsql set search_path=public as $$
declare f fixtures;
begin
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status<>'scheduled' then raise exception 'Only a Scheduled fixture can start.'; end if;
 if f.league_id is not null and not exists(select 1 from leagues where id=f.league_id and status='active') then raise exception 'This league is archived.'; end if;
 perform id from polls where fixture_id=f.id for update;
 update polls set status='closed' where fixture_id=f.id;
 update fixtures set status='live',started_at=now(),home_score=case when sport<>'volleyball' then 0 end,away_score=case when sport<>'volleyball' then 0 end where id=f.id;
end $$;
create function public.admin_score(p_fixture_id uuid,p_side text,p_increment integer) returns void language plpgsql set search_path=public as $$
declare f fixtures;
begin
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status<>'live' or f.ended_at is not null or f.sport='volleyball' then raise exception 'Live Football or Basketball required.'; end if;
 if p_side is null or p_side not in ('home','away') or p_increment is null or p_increment not in (1,2,3)
   or (f.sport='football' and p_increment<>1) then raise exception 'Invalid score increment.'; end if;
 update fixtures set home_score=home_score+case when p_side='home' then p_increment else 0 end,
  away_score=away_score+case when p_side='away' then p_increment else 0 end where id=f.id;
 perform whistle_notify('live_score',(select home_name||' '||home_score||'–'||away_score||' '||away_name from fixtures where id=f.id));
end $$;
create function public.whistle_settle(p_fixture_id uuid) returns void language plpgsql set search_path=public as $$
declare f fixtures; result poll_choice;
begin
 select * into strict f from fixtures where id=p_fixture_id for update;
 if f.status<>'completed' then raise exception 'Only a confirmed played result earns Ws.'; end if;
 perform id from polls where fixture_id=f.id for update;
 result:=case f.winner_side when 'home' then 'win_home'::poll_choice when 'away' then 'win_away'::poll_choice else 'draw'::poll_choice end;
 update polls set status='closed' where fixture_id=f.id;
 insert into ws_ledger(vote_id,fixture_id,student_id,delta,revision)
 select v.id,f.id,v.student_id,case when v.choice=result then 50 else -25 end,f.settlement_revision
 from poll_votes v join polls p on p.id=v.poll_id where p.fixture_id=f.id
 on conflict(vote_id) do update set delta=excluded.delta,revision=excluded.revision,settled_at=now();
end $$;
create function public.admin_end(p_fixture_id uuid) returns jsonb language plpgsql set search_path=public as $$
declare f fixtures;
begin
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status<>'live' then raise exception 'Only a Live fixture can end.'; end if;
 if f.sport='volleyball' then
  update fixtures set ended_at=coalesce(ended_at,now()) where id=f.id; return jsonb_build_object('needs_result',true);
 end if;
 update fixtures set status='completed',ended_at=now(),settlement_revision=settlement_revision+1,
  winner_side=case when home_score>away_score then 'home' when away_score>home_score then 'away' end where id=f.id;
 perform whistle_settle(f.id); return jsonb_build_object('needs_result',false);
end $$;
create function public.admin_record_result(p_fixture_id uuid,p_home_sets integer,p_away_sets integer) returns void language plpgsql set search_path=public as $$
declare f fixtures;
begin
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status<>'live' or f.sport<>'volleyball' then raise exception 'A Live Volleyball fixture is required.'; end if;
 update fixtures set status='completed',home_sets=p_home_sets,away_sets=p_away_sets,
  winner_side=case when p_home_sets>p_away_sets then 'home' else 'away' end,
  ended_at=coalesce(ended_at,now()),settlement_revision=settlement_revision+1 where id=f.id;
 perform whistle_settle(f.id);
end $$;
create function public.admin_correct_result(p_fixture_id uuid,p_home integer default null,p_away integer default null,p_winner text default null) returns void language plpgsql set search_path=public as $$
declare f fixtures;
begin
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status not in ('completed','walkover') then raise exception 'A finalized result is required.'; end if;
 if f.status='walkover' then
  if p_winner is null or p_winner not in ('home','away') then raise exception 'Choose the walkover winner.'; end if;
  update fixtures set winner_side=p_winner where id=f.id; return;
 end if;
 if f.sport='volleyball' then
  update fixtures set home_sets=p_home,away_sets=p_away,winner_side=case when p_home>p_away then 'home' else 'away' end,
   settlement_revision=settlement_revision+1 where id=f.id;
 else
  update fixtures set home_score=p_home,away_score=p_away,
   winner_side=case when p_home>p_away then 'home' when p_away>p_home then 'away' end,
   settlement_revision=settlement_revision+1 where id=f.id;
 end if;
 perform whistle_settle(f.id);
end $$;
create function public.admin_walkover(p_fixture_id uuid,p_winner text) returns void language plpgsql set search_path=public as $$
declare f fixtures;
begin
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status not in ('scheduled','live') then raise exception 'Choose an unfinished match.'; end if;
 if p_winner is null or p_winner not in ('home','away') then raise exception 'Choose home or away.'; end if;
 perform id from polls where fixture_id=f.id for update;
 update polls set status='void' where fixture_id=f.id;
 update fixtures set status='walkover',winner_side=p_winner,home_score=null,away_score=null,home_sets=null,away_sets=null,ended_at=now() where id=f.id;
end $$;
create function public.admin_cancel(p_fixture_id uuid,p_reason text) returns void language plpgsql set search_path=public as $$
declare f fixtures;
begin
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status not in ('scheduled','live') then raise exception 'Only an unfinished match can be cancelled.'; end if;
 if p_reason is null or length(trim(p_reason)) not between 1 and 1000 then raise exception 'Enter a cancellation reason.'; end if;
 perform id from polls where fixture_id=f.id for update;
 update polls set status='void' where fixture_id=f.id;
 update fixtures set status='cancelled',cancellation_reason=trim(p_reason),winner_side=null,ended_at=now() where id=f.id;
end $$;
create function public.admin_delete_fixture(p_fixture_id uuid) returns void language plpgsql set search_path=public as $$
begin delete from fixtures where id=p_fixture_id; if not found then raise exception 'Fixture not found.'; end if; end $$;

create function public.student_vote(p_fixture_id uuid,p_student_id uuid,p_choice poll_choice) returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; p polls;
begin
 perform whistle_student(p_student_id);
 select * into f from fixtures where id=p_fixture_id for update;
 if not found or f.status<>'scheduled' or f.started_at is not null then raise exception 'Voting closes at Start Match.'; end if;
 if f.league_id is not null and not exists(select 1 from leagues where id=f.league_id and status='active') then raise exception 'This league is archived.'; end if;
 select * into p from polls where fixture_id=f.id for update;
 if not found or p.status<>'open' then raise exception 'This poll is closed.'; end if;
 if p_choice is null or (f.sport='volleyball' and p_choice='draw') then raise exception 'Choose a valid outcome.'; end if;
 insert into poll_votes(poll_id,student_id,choice) values(p.id,p_student_id,p_choice)
 on conflict(poll_id,student_id) do update set choice=excluded.choice,updated_at=now();
 return jsonb_build_object('ok',true);
end $$;

create function public.admin_set_logo(p_entity text,p_id uuid,p_path text,p_side text default null) returns void language plpgsql set search_path=public as $$
declare expected text;
begin
 if p_entity='teams' then expected:='teams/'||p_id::text||'/';
 elsif p_entity='fixtures' and p_side in ('home','away') then expected:='fixtures/'||p_id::text||'/'||p_side||'/';
 else raise exception 'Choose a team or fixture side.'; end if;
 if p_path is not null then
  if p_path !~ ('^'||expected||'[0-9a-f-]{36}\.(png|jpg|webp)$')
    or not exists(select 1 from storage.objects where bucket_id='team-logos' and name=p_path) then raise exception 'Upload a valid team logo first.'; end if;
 end if;
 if p_entity='teams' then
  update teams set logo_path=p_path where id=p_id and status='active';
 else
  if p_side='home' then update fixtures set home_logo_path=p_path where id=p_id;
  else update fixtures set away_logo_path=p_path where id=p_id; end if;
 end if;
 if not found then raise exception 'Team or match not found.'; end if;
end $$;
create function public.admin_archive(p_entity text,p_id uuid) returns void language plpgsql set search_path=public as $$
begin
 if p_entity='teams' then
  update teams set status='archived' where id=p_id;
 elsif p_entity='leagues' then
  perform id from leagues where id=p_id for update;
  if exists(select 1 from fixtures where league_id=p_id and status='live') then raise exception 'Finish or cancel Live matches before archiving.'; end if;
  update leagues set status='archived' where id=p_id;
  update polls set status='void' where fixture_id in(select id from fixtures where league_id=p_id and status='scheduled');
 else raise exception 'Only teams and leagues can be archived.'; end if;
end $$;
create function public.whistle_no_delete() returns trigger language plpgsql set search_path=public as $$
begin raise exception 'Archive this record instead of deleting it.'; end $$;
create trigger teams_no_delete before delete on public.teams for each row execute function public.whistle_no_delete();
create trigger leagues_no_delete before delete on public.leagues for each row execute function public.whistle_no_delete();

create view public.standings with (security_invoker=true) as
with totals as (
 select lt.league_id,t.id team_id,t.name,t.logo_initials,t.logo_path,l.sport,
 count(f.id)::integer played,
 count(f.id) filter(where f.winner_side=case when f.home_team_id=t.id then 'home' else 'away' end)::integer wins,
 count(f.id) filter(where f.status='completed' and f.winner_side is null)::integer draws,
 count(f.id) filter(where f.winner_side<>case when f.home_team_id=t.id then 'home' else 'away' end)::integer losses,
 coalesce(sum(case when f.status='completed' then case when f.home_team_id=t.id then f.home_score else f.away_score end else 0 end),0)::bigint scored,
 coalesce(sum(case when f.status='completed' then case when f.home_team_id=t.id then f.away_score else f.home_score end else 0 end),0)::bigint conceded,
 coalesce(sum(case when f.status='completed' then case when f.home_team_id=t.id then f.home_sets else f.away_sets end else 0 end),0)::bigint sets_won,
 coalesce(sum(case when f.status='completed' then case when f.home_team_id=t.id then f.away_sets else f.home_sets end else 0 end),0)::bigint sets_lost,
 coalesce(sum(case when f.id is null or l.sport='basketball' then 0
  when l.sport='football' then case when f.winner_side is null then 1 when f.winner_side=case when f.home_team_id=t.id then 'home' else 'away' end then 3 else 0 end
  when f.status='walkover' or least(f.home_sets,f.away_sets)=0 then case when f.winner_side=case when f.home_team_id=t.id then 'home' else 'away' end then 3 else 0 end
  else case when f.winner_side=case when f.home_team_id=t.id then 'home' else 'away' end then 2 else 1 end end),0)::bigint points
 from league_teams lt join leagues l on l.id=lt.league_id join teams t on t.id=lt.team_id
 left join fixtures f on f.league_id=l.id and t.id in(f.home_team_id,f.away_team_id) and f.status in ('completed','walkover')
 group by lt.league_id,t.id,l.sport
), measures as (
 select *,scored-conceded difference,sets_won-sets_lost set_difference,
 case when played=0 then 0::numeric else wins::numeric/played end pct from totals
)
select (rank() over(partition by league_id order by
 case when sport='basketball' then pct else points::numeric end desc,
 case when sport='volleyball' then wins else difference end desc,
 case when sport='volleyball' then set_difference else scored end desc,
 case when sport='volleyball' then sets_won else 0 end desc))::integer rank,* from measures;
create view public.ws_leaderboard with (security_invoker=true) as
with totals as (
 select s.id student_id,s.name,s.matric_number,s.faculty,coalesce(sum(w.delta),0)::bigint ws,
 count(w.vote_id)::integer predictions,count(w.vote_id) filter(where w.delta=50)::integer correct
 from students s left join ws_ledger w on w.student_id=s.id where not s.is_admin group by s.id
)
select (rank() over(order by ws desc))::integer rank,* from totals;
create function public.admin_standings(p_league_id uuid) returns jsonb language sql set search_path=public as $$
 select coalesce(jsonb_agg(to_jsonb(s) order by rank,name),'[]') from standings s where league_id=p_league_id
$$;
create function public.whistle_poll_snapshot(p_fixture_id uuid,p_student_id uuid default null) returns jsonb language plpgsql set search_path=public as $$
declare f fixtures; p polls;
begin
 select * into f from fixtures where id=p_fixture_id;
 if not found or (f.league_id is not null and not exists(select 1 from leagues where id=f.league_id and status='active')) then raise exception 'Fixture not found.'; end if;
 select * into strict p from polls where fixture_id=f.id;
 return jsonb_build_object('fixture_id',f.id,'status',p.status,'can_vote',p.status='open' and f.status='scheduled',
 'my_choice',(select choice from poll_votes where poll_id=p.id and student_id=p_student_id),
 'my_ws',(select delta from ws_ledger where fixture_id=f.id and student_id=p_student_id),
 'total',(select count(*) from poll_votes where poll_id=p.id),
 'tally',jsonb_build_object('win_home',(select count(*) from poll_votes where poll_id=p.id and choice='win_home'),
 'draw',(select count(*) from poll_votes where poll_id=p.id and choice='draw'),
 'win_away',(select count(*) from poll_votes where poll_id=p.id and choice='win_away')));
end $$;
create function public.public_home() returns jsonb language sql set search_path=public as $$
 select jsonb_build_object(
 'teams',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'sport',sport,'logo_initials',logo_initials,'logo_path',logo_path)),'[]') from teams),
 'leagues',(select coalesce(jsonb_agg(to_jsonb(l)),'[]') from leagues l where status='active'),
 'fixtures',(select coalesce(jsonb_agg(to_jsonb(f)),'[]') from fixtures f where f.league_id is null or exists(select 1 from leagues l where l.id=f.league_id and l.status='active')),
 'standings',(select coalesce(jsonb_agg(to_jsonb(s) order by league_id,rank,name),'[]') from standings s where exists(select 1 from leagues l where l.id=s.league_id and l.status='active')),
 'polls',(select coalesce(jsonb_agg(whistle_poll_snapshot(f.id)),'[]') from fixtures f where f.league_id is null or exists(select 1 from leagues l where l.id=f.league_id and l.status='active')))
$$;
create function public.student_overview(p_student_id uuid) returns jsonb language plpgsql set search_path=public as $$
begin
 perform whistle_student(p_student_id);
 return public_home()||jsonb_build_object(
 'my_team_ids',(select coalesce(jsonb_agg(team_id),'[]') from team_players tp join teams t on t.id=tp.team_id where tp.student_id=p_student_id and t.status='active'),
 'my_polls',(select coalesce(jsonb_agg(whistle_poll_snapshot(f.id,p_student_id)),'[]') from fixtures f where f.league_id is null or exists(select 1 from leagues l where l.id=f.league_id and l.status='active')),
 'ws',(select ws from ws_leaderboard where student_id=p_student_id));
end $$;
create function public.student_profile(p_student_id uuid) returns jsonb language plpgsql set search_path=public as $$
begin
 perform whistle_student(p_student_id);
 return jsonb_build_object('profile',(select jsonb_build_object('name',name,'email',email,'matric_number',matric_number,'faculty',faculty,'notifications_enabled',notifications_enabled) from students where id=p_student_id),
 'teams',(select coalesce(jsonb_agg(to_jsonb(t)),'[]') from teams t join team_players tp on tp.team_id=t.id where tp.student_id=p_student_id),
 'prediction',(select to_jsonb(w)-'student_id'-'matric_number' from ws_leaderboard w where student_id=p_student_id));
end $$;
create function public.student_leaderboard(p_student_id uuid) returns jsonb language plpgsql set search_path=public as $$
begin perform whistle_student(p_student_id);
 return (select coalesce(jsonb_agg((to_jsonb(w)-'matric_number'-'student_id')||jsonb_build_object('is_me',student_id=p_student_id) order by rank,name),'[]') from ws_leaderboard w);
end $$;
create function public.student_notifications(p_student_id uuid) returns jsonb language plpgsql set search_path=public as $$
begin perform whistle_student(p_student_id);
 return jsonb_build_object('notifications_enabled',(select notifications_enabled from students where id=p_student_id),
 'notifications',(select coalesce(jsonb_agg(to_jsonb(n)-'student_id' order by created_at desc,id),'[]') from notifications n where student_id=p_student_id));
end $$;
create function public.student_read_notifications(p_student_id uuid,p_notification_ids uuid[]) returns void language plpgsql set search_path=public as $$
begin
 perform whistle_student(p_student_id);
 if p_notification_ids is null or cardinality(p_notification_ids)>200 then raise exception 'Select up to 200 notifications.'; end if;
 if exists(select 1 from unnest(p_notification_ids) x where not exists(select 1 from notifications where id=x and student_id=p_student_id)) then raise exception 'Notification unavailable.'; end if;
 update notifications set read=true where student_id=p_student_id and id=any(p_notification_ids);
end $$;
create function public.student_set_notifications(p_student_id uuid,p_enabled boolean) returns boolean language plpgsql set search_path=public as $$
begin perform whistle_student(p_student_id); if p_enabled is null then raise exception 'Choose on or off.'; end if;
 update students set notifications_enabled=p_enabled where id=p_student_id; return p_enabled;
end $$;
create function public.student_submit_feedback(p_id uuid,p_student_id uuid,p_category feedback_category,p_message text) returns uuid language plpgsql set search_path=public as $$
declare f feedback;
begin
 perform whistle_student(p_student_id);
 if p_id is null or p_category is null or p_message is null or length(trim(p_message)) not between 1 and 5000 or p_message !~ '[^[:space:]]' then raise exception 'Enter a category and 1–5000 characters.'; end if;
 insert into feedback(id,student_id,category,message) values(p_id,p_student_id,p_category,trim(p_message)) on conflict(id) do nothing;
 select * into strict f from feedback where id=p_id;
 if f.student_id<>p_student_id or f.category<>p_category or f.message<>trim(p_message) then raise exception 'Submission identifier already used.'; end if;
 return p_id;
end $$;
create function public.admin_review_feedback(p_id uuid,p_status feedback_status) returns void language plpgsql set search_path=public as $$
begin if p_status is null or p_status not in ('reviewed','resolved') then raise exception 'Choose Reviewed or Resolved.'; end if;
 update feedback set status=p_status where id=p_id; if not found then raise exception 'Feedback not found.'; end if;
end $$;
create function public.admin_snapshot() returns jsonb language plpgsql set search_path=public as $$
declare result jsonb:='{}'; t text; rows jsonb;
begin
 foreach t in array array['students','teams','team_players','leagues','league_teams','league_players','fixtures','polls','feedback'] loop
  execute format('select coalesce(jsonb_agg(to_jsonb(x)),''[]''::jsonb) from public.%I x',t) into rows;
  result:=result||jsonb_build_object(t,rows);
 end loop;
 return result;
end $$;

-- Optional player details, kept in sync with migrations/20261102_match_player_details.sql.

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

-- Fixture detail projections and last-five league form.
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

-- No direct browser mutations, roster reads, raw votes, ledger, or admin access.
do $$ declare t text; begin
 foreach t in array array['students','teams','team_players','leagues','league_teams','league_players','fixtures','polls','poll_votes','ws_ledger','notifications','feedback'] loop
  execute format('alter table public.%I enable row level security',t);
 end loop;
end $$;
create policy students_own_profile on public.students for select to authenticated using(auth_user_id=auth.uid());
revoke all on all tables in schema public from public,anon,authenticated;
grant select on public.students to authenticated;
grant all on all tables in schema public to service_role;
revoke execute on all functions in schema public from public,anon,authenticated;
grant execute on all functions in schema public to service_role;
grant usage on schema public to anon,authenticated,service_role;
-- Prevent future functions/tables reverting to PUBLIC execute by accident.
alter default privileges in schema public revoke execute on functions from public;
alter default privileges in schema public revoke all on tables from anon,authenticated;
notify pgrst, 'reload schema';
commit;
