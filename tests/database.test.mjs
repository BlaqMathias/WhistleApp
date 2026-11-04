import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('League logos enforce active ownership, remain visible in projections and survive repeatable migration',async t=>{
 const db=await database();t.after(()=>db.close());const p=[];
 for(let i=1;i<=2;i++)p.push((await register(db,i)).profile.id);
 const ts=await teams(db,'football',p),l=await league(db,'football',ts),other=await call(db,'admin_create_league',{p_name:'Other logo league',p_sport:'football',p_season:'2026',p_team_ids:ts});
 const path=`leagues/${l}/${randomUUID()}.png`;await db.query("insert into storage.objects(bucket_id,name) values('team-logos',$1)",[path]);
 await call(db,'admin_set_logo',{p_entity:'leagues',p_id:l,p_path:path});
 assert.equal((await row(db,'select logo_path from leagues where id=$1',[l])).logo_path,path);
 assert.equal((await call(db,'public_home')).leagues.find(x=>x.id===l).logo_path,path);
 const f=await row(db,'select id from fixtures where league_id=$1 limit 1',[l]);assert.equal((await call(db,'public_fixture',{p_fixture_id:f.id})).league.logo_path,path);
 assert.equal((await call(db,'student_overview',{p_student_id:p[0]})).leagues.find(x=>x.id===l).logo_path,path);
 await assert.rejects(call(db,'admin_set_logo',{p_entity:'leagues',p_id:other,p_path:path}));
 await assert.rejects(call(db,'admin_set_logo',{p_entity:'teams',p_id:ts[0],p_path:path}));
 await assert.rejects(call(db,'admin_set_logo',{p_entity:'leagues',p_id:l,p_path:`leagues/${l}/${randomUUID()}.png`}));
 const before=(await db.query('select * from fixtures order by id')).rows;
 for(let i=0;i<2;i++)await db.exec(await file('migrations/20261103060000_league_logos.sql'));
 assert.deepEqual((await db.query('select * from fixtures order by id')).rows,before);
 assert.equal((await row(db,'select logo_path from leagues where id=$1',[l])).logo_path,path);
 for(const role of ['anon','authenticated']){
  await db.exec('set role '+role);await assert.rejects(call(db,'admin_set_logo',{p_entity:'leagues',p_id:l,p_path:null}),{code:'42501'});await db.exec('reset role');
 }
 await call(db,'admin_set_logo',{p_entity:'leagues',p_id:l,p_path:null});assert.equal((await row(db,'select logo_path from leagues where id=$1',[l])).logo_path,null);
 await call(db,'admin_archive',{p_entity:'leagues',p_id:l});await assert.rejects(call(db,'admin_set_logo',{p_entity:'leagues',p_id:l,p_path:path}));
});


test('Fixture squad stats follow player identities, preserve match participants and hide voided stats',async t=>{
 const db=await database();t.after(()=>db.close());const p=[];
 for(let i=1;i<=5;i++)p.push((await register(db,i,{metadata:{name:i<=2?'Same Name':`Player ${i}`}})).profile.id);
 const h=await call(db,'admin_save_team',{p_id:null,p_name:'Scoring Home',p_sport:'football',p_student_ids:[p[0],p[1],p[4]]});
 const a=await call(db,'admin_save_team',{p_id:null,p_name:'Scoring Away',p_sport:'football',p_student_ids:[p[2],p[3]]});
 const l=await league(db,'football',[h,a]);
 const f=(await row(db,'select id from fixtures where league_id=$1 and home_team_id=$2',[l,h])).id;
 let view=await call(db,'public_fixture',{p_fixture_id:f});
 assert.ok(view.squads.home.every(x=>x.goals===0&&x.assists===0));
 await call(db,'admin_start',{p_fixture_id:f});
 for(let i=0;i<2;i++)await call(db,'admin_score',{p_fixture_id:f,p_side:'home',p_increment:1});
 const player=(side,id)=>({side,student_id:id});
 const details={man_of_the_match:null,goals:Array.from({length:2},()=>({side:'home',scorer:player('home',p[0]),assist:player('home',p[1])}))};
 await call(db,'admin_save_player_details',{p_fixture_id:f,p_details:details});
 view=await call(db,'public_fixture',{p_fixture_id:f});
 assert.deepEqual(view.squads.home.filter(x=>x.name==='Same Name').map(x=>[x.goals,x.assists]).sort(),[[0,2],[2,0]]);
 assert.ok(view.squads.away.every(x=>x.goals===0&&x.assists===0));
 assert.deepEqual(view.squads.home.find(x=>x.name==='Player 5'),{name:'Player 5',goals:0,assists:0});
 for(const id of p)assert.ok(!JSON.stringify(view.squads).includes(id));
 await call(db,'admin_end',{p_fixture_id:f});
 await call(db,'admin_save_team',{p_id:h,p_name:'Scoring Home',p_sport:'football',p_student_ids:[p[1],p[4]]});
 view=await call(db,'public_fixture',{p_fixture_id:f});
 assert.equal(view.squads.home.length,3,'recorded scorer remains visible after leaving current roster');
 assert.ok(view.squads.home.some(x=>x.goals===2));
 const temporary=await call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'Typed Highlight Home',p_away_name:'Typed Highlight Away'});
 await call(db,'admin_start',{p_fixture_id:temporary});await call(db,'admin_score',{p_fixture_id:temporary,p_side:'home',p_increment:1});
 await call(db,'admin_save_player_details',{p_fixture_id:temporary,p_details:{man_of_the_match:null,goals:[{side:'home',scorer:{side:'home',name:'Typed Scorer'},assist:{side:'home',name:'Typed Creator'}}]}});
 const typed=await call(db,'public_fixture',{p_fixture_id:temporary});
 assert.deepEqual(typed.squads.home,[{name:'Typed Creator',goals:0,assists:1},{name:'Typed Scorer',goals:1,assists:0}]);
 await call(db,'admin_cancel',{p_fixture_id:temporary,p_reason:'Abandoned'});
 assert.deepEqual((await call(db,'public_fixture',{p_fixture_id:temporary})).squads,{home:[],away:[]});
 const before=(await db.query('select * from fixtures order by id')).rows;
 for(let i=0;i<2;i++)await db.exec(await file('migrations/20261103050000_squad_match_stats.sql'));
 assert.deepEqual((await db.query('select * from fixtures order by id')).rows,before);
 for(const role of ['anon','authenticated']){
  await db.exec('set role '+role);
  await assert.rejects(call(db,'whistle_fixture_squad',{p_fixture_id:f,p_side:'home'}),{code:'42501'});
  await assert.rejects(call(db,'public_fixture',{p_fixture_id:f}),{code:'42501'});
  await db.exec('reset role');
 }
 await db.exec('set role service_role');
 assert.equal((await call(db,'whistle_fixture_squad',{p_fixture_id:f,p_side:'home'})).length,3);
});

test('Fresh and add-on samples contain completed scorer/assist data and can be rerun without changing matches or Ws',async t=>{
 const db=await database();t.after(()=>db.close());
 for(let i=1;i<=4;i++){const p=await register(db,i);await db.query('update students set is_demo=true where id=$1',[p.profile.id]);}
 await db.exec(await file('seed_match_highlights.sql'));
 const sample=await row(db,"select * from fixtures where home_name='Demo Goal Makers' and away_name='Demo Playmakers'");
 assert.equal(sample.status,'completed');assert.equal(sample.home_score,3);assert.equal(sample.away_score,1);assert.equal(sample.player_details.goals.length,4);
 const view=await call(db,'public_fixture',{p_fixture_id:sample.id});
 assert.deepEqual(view.squads.home.map(x=>[x.goals,x.assists]).sort(),[[1,2],[2,1]]);
 assert.deepEqual(view.squads.away.map(x=>[x.goals,x.assists]).sort(),[[0,1],[1,0]]);
 const before=(await db.query('select * from fixtures order by id')).rows,ledger=(await db.query('select * from ws_ledger order by vote_id')).rows;
 for(let i=0;i<2;i++)await db.exec(await file('seed_match_highlights.sql'));
 assert.deepEqual((await db.query('select * from fixtures order by id')).rows,before);
 assert.deepEqual((await db.query('select * from ws_ledger order by vote_id')).rows,ledger);
 await db.exec(await file('seed.sql'));
 assert.equal((await row(db,"select count(*)::int n from fixtures where home_name='Demo Goal Makers' and away_name='Demo Playmakers'")).n,1);
 await db.query('delete from team_players where team_id in ($1,$2)',[sample.home_team_id,sample.away_team_id]);
 assert.equal((await call(db,'public_fixture',{p_fixture_id:sample.id})).squads.home.length,2);
});


const file = name => readFile(new URL('../supabase/'+name, import.meta.url),'utf8');
async function database() {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}',email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create schema storage; create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
    grant usage on schema auth,storage to service_role; grant select on storage.objects to service_role;`);
  try {await db.exec(await file('schema.sql'));}
  catch(e){throw new Error(`Schema install: ${e.message}; position ${e.position || e.internalPosition || ''}`);}
  return db;
}
async function call(db,name,args={}) {
  const keys=Object.keys(args);
  return (await db.query(`select public.${name}(${keys.map((k,i)=>k+' => $'+(i+1)).join(',')}) value`,Object.values(args))).rows[0].value;
}
async function register(db,n,{confirmed=true,metadata={}}={}) {
  const id=randomUUID();
  await db.query('insert into auth.users(id,email,raw_user_meta_data,email_confirmed_at) values($1,$2,$3,$4)',
    [id,`test${n}@topfaith.edu.ng`,JSON.stringify({name:`Student ${n}`,faculty:'COMPASS',...metadata}),confirmed?new Date().toISOString():null]);
  const p=(await db.query('select * from students where auth_user_id=$1',[id])).rows[0];
  return {id,profile:p};
}
async function teams(db,sport,students) {
  const ids=[];
  for(let i=0;i<students.length;i++) ids.push(await call(db,'admin_save_team',{p_id:null,p_name:`${sport} Team ${i}`,p_sport:sport,p_student_ids:[students[i]]}));
  return ids;
}
async function league(db,sport,ids,best=null) {
  return call(db,'admin_create_league',{p_name:`${sport} league`,p_sport:sport,p_season:'2026',p_team_ids:ids,p_best_of:best});
}
const row=async(db,sql,args=[]) => (await db.query(sql,args)).rows[0];

test('Confirmed campus identity, metadata cannot grant admin, and own-profile RLS',async t=>{
 const db=await database();t.after(()=>db.close());
 const pending=await register(db,1,{confirmed:false});assert.equal(pending.profile,undefined);
 await db.query('update auth.users set email_confirmed_at=now() where id=$1',[pending.id]);
 const first=await row(db,'select * from students where auth_user_id=$1',[pending.id]);
 assert.equal(first.matric_number,'test1');assert.equal(first.is_admin,false);
 const second=await register(db,2,{metadata:{is_admin:true}});assert.equal(second.profile.is_admin,false);
 await assert.rejects(db.query('insert into auth.users(id,email,raw_user_meta_data,email_confirmed_at) values($1,$2,$3,now())',[randomUUID(),'outside@example.com',JSON.stringify({name:'Outside',faculty:'COMPASS'})]));
 await call(db,'admin_bootstrap',{p_auth_user_id:pending.id});
 await assert.rejects(call(db,'admin_bootstrap',{p_auth_user_id:second.id}));
 await db.query("select set_config('request.jwt.claim.sub',$1,false)",[second.id]);await db.exec('set role authenticated');
 assert.equal((await db.query('select * from students')).rows.length,1);
 await assert.rejects(db.query('update students set is_admin=true'));
 for(const name of ['admin_snapshot','public_home']) await assert.rejects(call(db,name));
 await assert.rejects(db.query('select * from poll_votes'));await assert.rejects(db.query('select * from ws_ledger'));
 await db.exec('reset role');
 await db.exec('set role service_role');
 await assert.rejects(db.query('select * from auth.users'),'no managed-schema table grant is needed by the app role');
 assert.equal((await call(db,'student_profile',{p_student_id:second.profile.id})).profile.email,'test2@topfaith.edu.ng');
 await db.exec('reset role');
});

test('Team roster eligibility, per-league uniqueness, editable rosters and generated home/away rounds',async t=>{
 const db=await database();t.after(()=>db.close());const players=[];
 for(let i=0;i<5;i++) players.push((await register(db,i)).profile.id);
 await assert.rejects(call(db,'admin_save_team',{p_id:null,p_name:'Empty',p_sport:'football',p_student_ids:[]}));
 await assert.rejects(call(db,'admin_save_team',{p_id:null,p_name:'Duplicate',p_sport:'football',p_student_ids:[players[0],players[0]]}));
 await assert.rejects(call(db,'admin_save_team',{p_id:null,p_name:'Unknown',p_sport:'football',p_student_ids:[randomUUID()]}));
 const ids=await teams(db,'football',players);const id=await league(db,'football',ids.slice(0,3));
 let rows=(await db.query('select * from fixtures where league_id=$1',[id])).rows;
 assert.equal(rows.length,6);assert.ok(rows.every(f=>f.status==='scheduled'&&f.scheduled_at===null));
 assert.equal(new Set(rows.map(f=>f.home_team_id+f.away_team_id)).size,6);
 for(let r=1;r<=6;r++) assert.equal(rows.filter(f=>f.round_number===r).length,1);
 assert.equal((await row(db,'select count(*)::int n from polls where status=\'open\'')).n,6);
 const conflicting=await call(db,'admin_save_team',{p_id:null,p_name:'Conflict',p_sport:'football',p_student_ids:[players[0]]});
 await assert.rejects(call(db,'admin_add_league_team',{p_league_id:id,p_team_id:conflicting}));
 await assert.rejects(call(db,'admin_save_team',{p_id:ids[1],p_name:'Changed',p_sport:'football',p_student_ids:[players[0]]}));
 await call(db,'admin_add_league_team',{p_league_id:id,p_team_id:ids[3]});
 assert.equal((await row(db,'select count(*)::int n from fixtures where league_id=$1',[id])).n,12);
 const extra=await call(db,'admin_add_fixture',{p_league_id:id,p_home:ids[0],p_away:ids[1]});
 await call(db,'admin_delete_fixture',{p_fixture_id:extra});
 const deleted=rows[0];await call(db,'admin_delete_fixture',{p_fixture_id:deleted.id});
 await call(db,'admin_generate_fixtures',{p_league_id:id});
 assert.equal((await row(db,'select count(*)::int n from fixtures where league_id=$1',[id])).n,11,'repeat generation must not restore admin-deleted fixtures');
 const even=await league(db,'basketball',await teams(db,'basketball',players.slice(0,4)));
 rows=(await db.query('select * from fixtures where league_id=$1',[even])).rows;assert.equal(rows.length,12);
 for(let r=1;r<=6;r++) assert.equal(rows.filter(f=>f.round_number===r).length,2);
});

test('Predictions open on creation; scheduled time never starts a match; Start closes votes and locks deletion',async t=>{
 const db=await database();t.after(()=>db.close());const a=(await register(db,1)).profile.id,b=(await register(db,2)).profile.id;
 const f=await call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'Visitors A',p_away_name:'Visitors B'});
 let p=await call(db,'whistle_poll_snapshot',{p_fixture_id:f});assert.equal(p.status,'open');assert.equal(p.total,0);assert.equal(p.my_choice,null);
 await call(db,'student_vote',{p_fixture_id:f,p_student_id:a,p_choice:'win_home'});
 await call(db,'student_vote',{p_fixture_id:f,p_student_id:a,p_choice:'draw'});
 await call(db,'student_vote',{p_fixture_id:f,p_student_id:b,p_choice:'win_away'});
 p=await call(db,'whistle_poll_snapshot',{p_fixture_id:f,p_student_id:a});assert.equal(p.total,2);assert.equal(p.my_choice,'draw');
 await call(db,'admin_reschedule',{p_fixture_id:f,p_scheduled_at:'2020-01-01T00:00:00Z',p_venue:'Pitch'});
 const home=await call(db,'public_home');assert.equal(home.fixtures[0].status,'scheduled');assert.equal(home.polls[0].can_vote,true);
 assert.ok(!JSON.stringify(home).includes(a));assert.ok(!JSON.stringify(home).includes('test1@'));
 await call(db,'admin_start',{p_fixture_id:f});
 assert.equal((await call(db,'whistle_poll_snapshot',{p_fixture_id:f})).status,'closed');
 await assert.rejects(call(db,'student_vote',{p_fixture_id:f,p_student_id:a,p_choice:'win_home'}));
 await assert.rejects(call(db,'admin_delete_fixture',{p_fixture_id:f}),'even a zero-zero match is protected after Start');
 await assert.rejects(call(db,'admin_reschedule',{p_fixture_id:f,p_scheduled_at:new Date().toISOString(),p_venue:'Other'}));
 await assert.rejects(call(db,'admin_score',{p_fixture_id:f,p_side:'home',p_increment:2}));
 await call(db,'admin_end',{p_fixture_id:f});
 assert.equal((await row(db,'select ws from ws_leaderboard where student_id=$1',[a])).ws,50);
 assert.equal((await row(db,'select ws from ws_leaderboard where student_id=$1',[b])).ws,-25);
 await assert.rejects(call(db,'admin_end',{p_fixture_id:f}));
 assert.equal((await row(db,'select count(*)::int n from ws_ledger')).n,2);
 await call(db,'admin_correct_result',{p_fixture_id:f,p_home:1,p_away:2});
 assert.equal((await row(db,'select ws from ws_leaderboard where student_id=$1',[a])).ws,-25);
 assert.equal((await row(db,'select ws from ws_leaderboard where student_id=$1',[b])).ws,50);
 await call(db,'admin_correct_result',{p_fixture_id:f,p_home:1,p_away:2});
 assert.equal((await row(db,'select ws from ws_leaderboard where student_id=$1',[b])).ws,50);
 await assert.rejects(call(db,'admin_delete_fixture',{p_fixture_id:f}));
});

test('Cancelled fixtures and walkovers remain in history, void polls, never earn or deduct Ws',async t=>{
 const db=await database();t.after(()=>db.close());const a=(await register(db,1)).profile.id;
 for(const live of [false,true])for(const action of ['walkover','cancel']){
  const f=await call(db,'admin_create_friendly',{p_sport:'basketball',p_home_name:'Home',p_away_name:'Away'});
  await call(db,'student_vote',{p_fixture_id:f,p_student_id:a,p_choice:'draw'});
  if(live){await call(db,'admin_start',{p_fixture_id:f});await call(db,'admin_score',{p_fixture_id:f,p_side:'away',p_increment:3});}
  if(action==='walkover') await call(db,'admin_walkover',{p_fixture_id:f,p_winner:'home'});
  else await call(db,'admin_cancel',{p_fixture_id:f,p_reason:'Rain / venue unavailable'});
  const p=await call(db,'whistle_poll_snapshot',{p_fixture_id:f});assert.equal(p.status,'void');assert.equal(p.my_ws,null);
  await assert.rejects(call(db,'admin_delete_fixture',{p_fixture_id:f}));
  await assert.rejects(call(db,'admin_start',{p_fixture_id:f}));
 }
 assert.equal((await row(db,'select ws from ws_leaderboard where student_id=$1',[a])).ws,0);
});

test('Volleyball best-of validation rejects nulls, draws and wrong formats, settles only on final result',async t=>{
 const db=await database();t.after(()=>db.close());const a=(await register(db,1)).profile.id;
 for(const best of [3,5]){
  const f=await call(db,'admin_create_friendly',{p_sport:'volleyball',p_home_name:'Home',p_away_name:'Away',p_best_of:best});
  await assert.rejects(call(db,'student_vote',{p_fixture_id:f,p_student_id:a,p_choice:'draw'}));
  await call(db,'student_vote',{p_fixture_id:f,p_student_id:a,p_choice:'win_home'});await call(db,'admin_start',{p_fixture_id:f});
  await assert.rejects(call(db,'admin_score',{p_fixture_id:f,p_side:'home',p_increment:1}));
  const result=await call(db,'admin_end',{p_fixture_id:f});assert.equal(result.needs_result,true);
  assert.equal((await row(db,'select count(*)::int n from ws_ledger where fixture_id=$1',[f])).n,0);
  for(const [h,w] of [[null,null],[1,1],[2,2],[3,3],best===3?[3,1]:[2,1]])
   await assert.rejects(call(db,'admin_record_result',{p_fixture_id:f,p_home_sets:h,p_away_sets:w}));
  await call(db,'admin_record_result',{p_fixture_id:f,p_home_sets:best===3?2:3,p_away_sets:1});
  assert.equal((await row(db,'select delta from ws_ledger where fixture_id=$1',[f])).delta,50);
  await assert.rejects(call(db,'admin_correct_result',{p_fixture_id:f,p_home:null,p_away:null}));
 }
});

test('Standings use exact sport rules, new tie-breaks and exclude Friendly, live and cancelled results',async t=>{
 const db=await database();t.after(()=>db.close());const p=[];
 for(let i=1;i<=4;i++)p.push((await register(db,i)).profile.id);
 for(const sport of ['football','basketball','volleyball']){
  const ids=await teams(db,sport,p);const id=await league(db,sport,ids,sport==='volleyball'?5:null);
  const fs=(await db.query('select * from fixtures where league_id=$1 order by round_number,home_name',[id])).rows;
  await call(db,'admin_start',{p_fixture_id:fs[0].id});
  if(sport==='volleyball') await call(db,'admin_record_result',{p_fixture_id:fs[0].id,p_home_sets:3,p_away_sets:1});
  else {await call(db,'admin_score',{p_fixture_id:fs[0].id,p_side:'home',p_increment:1});await call(db,'admin_end',{p_fixture_id:fs[0].id});}
  let table=await call(db,'admin_standings',{p_league_id:id});let h=table.find(r=>r.team_id===fs[0].home_team_id),a=table.find(r=>r.team_id===fs[0].away_team_id);
  assert.equal(h.played,1);assert.equal(h.wins,1);assert.equal(a.losses,1);
  if(sport==='volleyball'){assert.equal(h.points,2);assert.equal(a.points,1);assert.equal(h.set_difference,2);}
  else if(sport==='football'){assert.equal(h.points,3);assert.equal(h.difference,1);assert.equal(a.points,0);}
  else{assert.equal(Number(h.pct),1);assert.equal(Number(a.pct),0);assert.equal(h.points,0);}
  // A valid draw dilutes Basketball PCT, and Football awards 1 each.
  const reverse=fs.find(f=>f.home_team_id===fs[0].away_team_id&&f.away_team_id===fs[0].home_team_id);
  await call(db,'admin_start',{p_fixture_id:reverse.id});
  if(sport==='volleyball')await call(db,'admin_record_result',{p_fixture_id:reverse.id,p_home_sets:3,p_away_sets:0});
  else await call(db,'admin_end',{p_fixture_id:reverse.id});
  table=await call(db,'admin_standings',{p_league_id:id});h=table.find(r=>r.team_id===fs[0].home_team_id);a=table.find(r=>r.team_id===fs[0].away_team_id);
  if(sport==='basketball'){assert.equal(h.draws,1);assert.equal(Number(h.pct),0.5);assert.equal(h.scored,1);}
  if(sport==='football'){assert.equal(h.points,4);assert.equal(a.points,1);}
  if(sport==='volleyball'){assert.equal(h.points,2);assert.equal(a.points,4);}
  const pending=fs.find(f=>f.id!==fs[0].id&&f.id!==reverse.id);await call(db,'admin_start',{p_fixture_id:pending.id});
  const before=await call(db,'admin_standings',{p_league_id:id});await call(db,'admin_cancel',{p_fixture_id:pending.id,p_reason:'Abandoned'});
  assert.deepEqual(await call(db,'admin_standings',{p_league_id:id}),before);
  const friendly=await call(db,'admin_create_friendly',{p_sport:sport,p_home_team_id:ids[0],p_away_team_id:ids[1],p_best_of:sport==='volleyball'?3:null});
  await call(db,'admin_walkover',{p_fixture_id:friendly,p_winner:'home'});
  assert.deepEqual(await call(db,'admin_standings',{p_league_id:id}),before);
 }
});

test('Ranking tie-breaks compare the full keys and preserve shared ranks for exact ties',async t=>{
 const db=await database();t.after(()=>db.close());const p=[];for(let i=0;i<3;i++)p.push((await register(db,i)).profile.id);
 for(const sport of ['football','basketball','volleyball']){
  const ids=await teams(db,sport,p);const id=await league(db,sport,ids,sport==='volleyball'?3:null);
  const result=async(home,away,h,a)=>{const f=await call(db,'admin_add_fixture',{p_league_id:id,p_home:home,p_away:away});await call(db,'admin_start',{p_fixture_id:f});
   if(sport==='volleyball')await call(db,'admin_record_result',{p_fixture_id:f,p_home_sets:h,p_away_sets:a});
   else {await call(db,'admin_end',{p_fixture_id:f});await call(db,'admin_correct_result',{p_fixture_id:f,p_home:h,p_away:a});}};
  if(sport==='volleyball'){
   await result(ids[0],ids[2],2,1);await result(ids[1],ids[2],2,1);
   let rows=await call(db,'admin_standings',{p_league_id:id});assert.equal(rows.find(r=>r.team_id===ids[0]).rank,rows.find(r=>r.team_id===ids[1]).rank);
   await result(ids[0],ids[1],2,0);rows=await call(db,'admin_standings',{p_league_id:id});assert.equal(rows[0].team_id,ids[0]);
  }else{
   await result(ids[0],ids[2],2,0);await result(ids[1],ids[2],3,1);
   let rows=await call(db,'admin_standings',{p_league_id:id});assert.equal(rows[0].team_id,ids[1],'same points/PCT and difference: more scored ranks first');
   await result(ids[0],ids[1],0,0);await result(ids[1],ids[0],0,0);
   rows=await call(db,'admin_standings',{p_league_id:id});assert.ok(rows.find(r=>r.team_id===ids[1]).rank<rows.find(r=>r.team_id===ids[0]).rank);
  }
 }
});

test('Temporary Friendly teams, optional permanent save, logo ownership paths and public data privacy',async t=>{
 const db=await database();t.after(()=>db.close());const a=(await register(db,1)).profile.id;
 const f=await call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'Typed Home',p_away_name:'Typed Away'});
 assert.equal((await row(db,'select count(*)::int n from teams')).n,0);
 const path=`fixtures/${f}/home/${randomUUID()}.png`;await db.query('insert into storage.objects(bucket_id,name) values($1,$2)',['team-logos',path]);
 await call(db,'admin_set_logo',{p_entity:'fixtures',p_id:f,p_path:path,p_side:'home'});
 assert.equal((await row(db,'select home_logo_path from fixtures where id=$1',[f])).home_logo_path,path);
 await assert.rejects(call(db,'admin_set_logo',{p_entity:'fixtures',p_id:f,p_path:path,p_side:'away'}));
 await assert.rejects(call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'Saved',p_away_name:'Other',p_save_home:true}));
 const saved=await call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'Saved',p_away_name:'Other',p_save_home:true,p_home_student_ids:[a]});
 assert.ok((await row(db,'select home_team_id from fixtures where id=$1',[saved])).home_team_id);
 const data=await call(db,'public_home');for(const key of ['email','auth_user_id','is_admin','student_id','proof_of_payment','registrations'])assert.ok(!JSON.stringify(data).includes('"'+key+'"'));
});

test('Notifications remain private, preferences suppress future updates, feedback retries preserve review',async t=>{
 const db=await database();t.after(()=>db.close());const a=(await register(db,1)).profile.id,b=(await register(db,2)).profile.id;
 await call(db,'student_set_notifications',{p_student_id:b,p_enabled:false});
 await call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'Home',p_away_name:'Away'});
 let n=await call(db,'student_notifications',{p_student_id:a});assert.equal(n.notifications.length,1);assert.equal(n.notifications[0].read,false);
 assert.equal((await call(db,'student_notifications',{p_student_id:b})).notifications.length,0);
 await assert.rejects(call(db,'student_read_notifications',{p_student_id:b,p_notification_ids:[n.notifications[0].id]}));
 await call(db,'student_read_notifications',{p_student_id:a,p_notification_ids:[n.notifications[0].id]});
 assert.equal((await call(db,'student_notifications',{p_student_id:a})).notifications[0].read,true);
 const id=randomUUID(),args={p_id:id,p_student_id:a,p_category:'bug',p_message:'  Feedback test  '};
 await call(db,'student_submit_feedback',args);await call(db,'admin_review_feedback',{p_id:id,p_status:'resolved'});await call(db,'student_submit_feedback',args);
 assert.equal((await row(db,'select status from feedback where id=$1',[id])).status,'resolved');
 await assert.rejects(call(db,'student_submit_feedback',{...args,p_student_id:b}));
});

test('Sample data installs atomically on a fresh schema and rejects a second seed',async t=>{
 const db=await database();t.after(()=>db.close());
 await assert.rejects(db.exec(await file('seed.sql')));await db.exec('rollback');
 for(let i=0;i<5;i++){const u=await register(db,i);await db.query('update students set is_demo=true where id=$1',[u.profile.id]);if(i===0)await call(db,'admin_bootstrap',{p_auth_user_id:u.id});}
 await db.exec(await file('seed.sql'));
 assert.equal((await row(db,'select count(*)::int n from leagues')).n,3);
 assert.equal((await row(db,'select count(*)::int n from fixtures where league_id is not null')).n,36);
 assert.equal((await row(db,'select count(*)::int n from fixtures where league_id is null')).n,4);
 assert.equal((await row(db,'select count(*)::int n from ws_leaderboard where ws<0')).n,2);
 await assert.rejects(db.exec(await file('seed.sql')));await db.exec('rollback');

});

test('Football player details enforce rosters, preserve name snapshots, hide account IDs and lock on End',async t=>{
 const db=await database();t.after(()=>db.close());const p=[];
 for(let i=1;i<=4;i++)p.push((await register(db,i)).profile.id);
 const home=await call(db,'admin_save_team',{p_id:null,p_name:'Detail Home',p_sport:'football',p_student_ids:p.slice(0,2)});
 const away=await call(db,'admin_save_team',{p_id:null,p_name:'Detail Away',p_sport:'football',p_student_ids:[p[2]]});
 const l=await league(db,'football',[home,away]);const f=await row(db,'select * from fixtures where league_id=$1 and home_team_id=$2 limit 1',[l,home]);
 const h=f.home_team_id===home?p[0]:p[2],a=f.home_team_id===home?p[2]:p[0];
 const player=(side,id)=>({side,student_id:id,name:'Forged name must be ignored'});
 const details={man_of_the_match:player('away',a),goals:[{side:'home',scorer:player('home',h),assist:player('home',p[1])}]};
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f.id,p_details:details}));
 await call(db,'admin_start',{p_fixture_id:f.id});
 await assert.rejects(call(db,'admin_end_with_players',{p_fixture_id:f.id,p_details:details}));
 assert.equal((await row(db,'select status from fixtures where id=$1',[f.id])).status,'live','invalid details must not end play');
 await call(db,'admin_score',{p_fixture_id:f.id,p_side:'home',p_increment:1});
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f.id,p_details:{...details,man_of_the_match:player('home',a)}}));
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f.id,p_details:{...details,man_of_the_match:player('home',p[3])}}));
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f.id,p_details:{...details,goals:[{...details.goals[0],assist:player('home',h)}]}}));
 const saved=await call(db,'admin_save_player_details',{p_fixture_id:f.id,p_details:details});
 assert.notEqual(saved.man_of_the_match.name,'Forged name must be ignored');
 await call(db,'admin_end',{p_fixture_id:f.id});
 const publicFixture=(await call(db,'public_home')).fixtures.find(x=>x.id===f.id);
 assert.equal(publicFixture.player_details.man_of_the_match.name,saved.man_of_the_match.name);
 assert.ok(!JSON.stringify(publicFixture.player_details).includes('student_id'));
 assert.ok(!JSON.stringify(publicFixture.player_details).includes(h));
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f.id,p_details:{man_of_the_match:null,goals:[]}}));
 await assert.rejects(db.query('update fixtures set player_details=$1 where id=$2',[JSON.stringify({man_of_the_match:null,goals:[]}),f.id]));
 await call(db,'admin_correct_result',{p_fixture_id:f.id,p_home:2,p_away:1});
 assert.deepEqual((await row(db,'select player_details from fixtures where id=$1',[f.id])).player_details,saved);
 await db.exec('set role authenticated');
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f.id,p_details:details}),{code:'42501'});
 await assert.rejects(call(db,'admin_end_with_players',{p_fixture_id:f.id,p_details:details}),{code:'42501'});
 await db.exec('reset role');
});

test('Temporary Friendly names, scorer/assist optionality and atomic End keep scoring and Ws independent',async t=>{
 const db=await database();t.after(()=>db.close());const p=(await register(db,1)).profile.id;
 const f=await call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'Typed Home',p_away_name:'Typed Away'});
 await call(db,'student_vote',{p_fixture_id:f,p_student_id:p,p_choice:'win_home'});
 await call(db,'admin_start',{p_fixture_id:f});
 for(let i=0;i<2;i++)await call(db,'admin_score',{p_fixture_id:f,p_side:'home',p_increment:1});
 const named=name=>({side:'home',name});
 const details={man_of_the_match:named('Captain'),goals:[{side:'home',scorer:named('Scorer'),assist:named('Creator')},{side:'home',scorer:null,assist:named('Creator')}]};
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f,p_details:{...details,man_of_the_match:{side:'home',student_id:p,name:'Captain'}}}));
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f,p_details:{...details,goals:[{side:'home',scorer:named('Same'),assist:named('same')}]}}));
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f,p_details:{...details,goals:[{side:'home',scorer:null,assist:null}]}}));
 await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f,p_details:{...details,man_of_the_match:{side:'home',name:' '.repeat(2)}}}));
 assert.equal((await row(db,'select count(*)::int n from ws_ledger')).n,0);
 await call(db,'admin_end_with_players',{p_fixture_id:f,p_details:details});
 const result=await row(db,'select * from fixtures where id=$1',[f]);
 assert.equal(result.home_score,2);assert.equal(result.player_details.goals.length,2);assert.equal(result.player_details.goals[0].assist.name,'Creator');
 assert.equal((await row(db,'select delta from ws_ledger where fixture_id=$1',[f])).delta,50);
 assert.equal((await row(db,'select count(*)::int n from teams')).n,0,'match-only names do not create teams or roster accounts');
 await assert.rejects(call(db,'admin_end_with_players',{p_fixture_id:f,p_details:details}));
 assert.equal((await row(db,'select count(*)::int n from ws_ledger')).n,1);
});

test('Other sports accept only optional Man of the Match; Volleyball locks before pending sets; migration is repeatable',async t=>{
 const db=await database();t.after(()=>db.close());
 for(const sport of ['basketball','volleyball']){
  const f=await call(db,'admin_create_friendly',{p_sport:sport,p_home_name:'Home',p_away_name:'Away',p_best_of:sport==='volleyball'?3:null});
  const details={man_of_the_match:{side:'away',name:'Visiting Player'},goals:[]};
  await call(db,'admin_start',{p_fixture_id:f});
  await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f,p_details:{...details,goals:[{side:'away',scorer:{side:'away',name:'No stats'},assist:null}]}}));
  await call(db,'admin_end_with_players',{p_fixture_id:f,p_details:details});
  await assert.rejects(call(db,'admin_save_player_details',{p_fixture_id:f,p_details:{...details,man_of_the_match:null}}));
  if(sport==='volleyball'){
   assert.equal((await row(db,'select status from fixtures where id=$1',[f])).status,'live');
   await call(db,'admin_record_result',{p_fixture_id:f,p_home_sets:2,p_away_sets:0});
  }
  assert.equal((await row(db,'select player_details from fixtures where id=$1',[f])).player_details.man_of_the_match.name,'Visiting Player');
 }
 const empty=await call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'No Award Home',p_away_name:'No Award Away'});
 await call(db,'admin_start',{p_fixture_id:empty});
 await call(db,'admin_end_with_players',{p_fixture_id:empty,p_details:{man_of_the_match:null,goals:[]}});
 const before=(await db.query('select * from fixtures order by id')).rows;
 for(let i=0;i<2;i++)await db.exec(await file('migrations/20261102_match_player_details.sql'));
 assert.deepEqual((await db.query('select * from fixtures order by id')).rows,before);
});

test('Public fixture projection returns display-only squads and own poll, respects archive visibility and browser RPC denial',async t=>{
 const db=await database();t.after(()=>db.close());const p=[];
 for(let i=1;i<=3;i++)p.push((await register(db,i)).profile.id);
 const ids=await teams(db,'football',p.slice(0,2)),l=await league(db,'football',ids);
 const f=await row(db,'select * from fixtures where league_id=$1 limit 1',[l]);
 await call(db,'student_vote',{p_fixture_id:f.id,p_student_id:p[0],p_choice:'draw'});
 await call(db,'student_vote',{p_fixture_id:f.id,p_student_id:p[1],p_choice:'win_home'});
 const data=await call(db,'public_fixture',{p_fixture_id:f.id});
 assert.equal(data.poll.my_choice,null);assert.equal(data.squads.home.length,1);assert.equal(data.squads.away.length,1);
 for(const key of ['student_id','email','matric_number','auth_user_id','is_admin'])assert.ok(!JSON.stringify(data).includes('"'+key+'"'));
 assert.equal((await call(db,'public_fixture',{p_fixture_id:f.id,p_student_id:p[0]})).poll.my_choice,'draw');
 assert.equal((await call(db,'public_fixture',{p_fixture_id:f.id,p_student_id:p[1]})).poll.my_choice,'win_home');
 assert.equal(await call(db,'public_fixture',{p_fixture_id:randomUUID()}),null);
 const friendly=await call(db,'admin_create_friendly',{p_sport:'football',p_home_name:'Unregistered Home',p_away_name:'Unregistered Away'});
 const temp=await call(db,'public_fixture',{p_fixture_id:friendly});assert.deepEqual(temp.squads,{home:[],away:[]});assert.equal(temp.league,null);assert.deepEqual(temp.standings,[]);
 for(const role of ['anon','authenticated']){
  await db.exec('set role '+role);
  await assert.rejects(call(db,'public_fixture',{p_fixture_id:f.id}),{code:'42501'});
  await db.exec('reset role');
 }
 await call(db,'admin_archive',{p_entity:'leagues',p_id:l});
 assert.equal(await call(db,'public_fixture',{p_fixture_id:f.id}),null);
});

test('Last five uses only finished games in the same league, oldest first, including walkovers and all sport results',async t=>{
 const db=await database();t.after(()=>db.close());const p=[];for(let i=1;i<=2;i++)p.push((await register(db,i)).profile.id);
 const ids=await teams(db,'football',p),l=await league(db,'football',ids);
 const outcomes=['W','D','L','W','L','D','W'];
 for(let i=0;i<outcomes.length;i++){
  const f=await call(db,'admin_add_fixture',{p_league_id:l,p_home:ids[0],p_away:ids[1]});
  await call(db,'admin_start',{p_fixture_id:f});await call(db,'admin_end',{p_fixture_id:f});
  await call(db,'admin_correct_result',{p_fixture_id:f,p_home:outcomes[i]==='W'?1:0,p_away:outcomes[i]==='L'?1:0});
  await db.query('update fixtures set ended_at=$1 where id=$2',[new Date(Date.UTC(2026,0,i+1)).toISOString(),f]);
 }
 let form=await call(db,'whistle_recent_form',{p_league_id:l,p_team_id:ids[0]});assert.deepEqual(form.map(x=>x.result),['L','W','L','D','W']);
 const f=await call(db,'admin_add_fixture',{p_league_id:l,p_home:ids[0],p_away:ids[1]});
 await call(db,'admin_walkover',{p_fixture_id:f,p_winner:'home'});
 const voided=await call(db,'admin_add_fixture',{p_league_id:l,p_home:ids[0],p_away:ids[1]});
 await call(db,'admin_cancel',{p_fixture_id:voided,p_reason:'No game'});
 const friendly=await call(db,'admin_create_friendly',{p_sport:'football',p_home_team_id:ids[0],p_away_team_id:ids[1]});
 await call(db,'admin_walkover',{p_fixture_id:friendly,p_winner:'away'});
 form=await call(db,'whistle_recent_form',{p_league_id:l,p_team_id:ids[0]});assert.deepEqual(form.map(x=>x.result),['W','L','D','W','W']);assert.equal(form.at(-1).score,'Walkover');
 assert.deepEqual((await call(db,'admin_standings',{p_league_id:l})).find(x=>x.team_id===ids[0]).form,form);
 assert.deepEqual((await call(db,'public_home')).standings.find(x=>x.team_id===ids[0]).form,form);
 for(const sport of ['basketball','volleyball']){
  const ts=await teams(db,sport,p),leagueId=await league(db,sport,ts,sport==='volleyball'?3:null);
  const fixture=await call(db,'admin_add_fixture',{p_league_id:leagueId,p_home:ts[0],p_away:ts[1]});
  await call(db,'admin_start',{p_fixture_id:fixture});
  if(sport==='volleyball')await call(db,'admin_record_result',{p_fixture_id:fixture,p_home_sets:1,p_away_sets:2});
  else await call(db,'admin_end',{p_fixture_id:fixture});
  const games=await call(db,'whistle_recent_form',{p_league_id:leagueId,p_team_id:ts[0]});assert.equal(games[0].result,sport==='volleyball'?'L':'D');
  assert.equal(games[0].score,sport==='volleyball'?'1–2 sets':'0–0');
 }
 const before=(await db.query('select * from fixtures order by id')).rows;
 for(let i=0;i<2;i++)await db.exec(await file('migrations/20261102190000_fixture_pages_and_form.sql'));
 assert.deepEqual((await db.query('select * from fixtures order by id')).rows,before);
});

test('Personal prediction history includes archived picks, current corrected Ws and voids without exposing another student',async t=>{
 const db=await database();t.after(()=>db.close());const ids=[];
 for(let i=1;i<=3;i++)ids.push((await register(db,i)).profile.id);
 const ts=await teams(db,'football',ids.slice(0,2)),l=await league(db,'football',ts);
 const fixtures=(await db.query('select id from fixtures where league_id=$1 order by id',[l])).rows;
 const done=fixtures[0].id,pending=fixtures[1].id;
 await call(db,'student_vote',{p_fixture_id:done,p_student_id:ids[0],p_choice:'draw'});
 await call(db,'student_vote',{p_fixture_id:done,p_student_id:ids[1],p_choice:'win_away'});
 await call(db,'student_vote',{p_fixture_id:pending,p_student_id:ids[0],p_choice:'win_home'});
 const history=()=>call(db,'student_prediction_history',{p_student_id:ids[0]});
 let h=await history();assert.equal(h.entries.length,2);assert.ok(h.entries.every(e=>e.ws===null));
 await call(db,'admin_start',{p_fixture_id:done});await call(db,'admin_end',{p_fixture_id:done});
 h=await history();assert.equal(h.entries.find(e=>e.fixture.id===done).ws,50);
 await call(db,'admin_correct_result',{p_fixture_id:done,p_home:1,p_away:0});
 h=await history();assert.equal(h.entries.find(e=>e.fixture.id===done).ws,-25);
 assert.equal((await call(db,'student_profile',{p_student_id:ids[0]})).prediction.ws,-25);
 await call(db,'admin_archive',{p_entity:'leagues',p_id:l});
 h=await history();assert.equal(h.entries.length,2);assert.equal(h.entries.find(e=>e.fixture.id===pending).poll_status,'void');assert.equal(h.leagues[0].status,'archived');
 assert.equal((await call(db,'public_fixture',{p_fixture_id:done,p_student_id:ids[0]})).fixture.id,done);
 assert.equal(await call(db,'public_fixture',{p_fixture_id:done,p_student_id:ids[2]}),null);
 assert.equal(await call(db,'public_fixture',{p_fixture_id:done}),null);
 await assert.rejects(call(db,'whistle_poll_snapshot',{p_fixture_id:done,p_student_id:ids[2]}));
 assert.equal((await call(db,'student_prediction_history',{p_student_id:ids[2]})).entries.length,0);
 for(const id of ids)assert.ok(!JSON.stringify(h).includes(id));assert.ok(!JSON.stringify(h).includes('@topfaith'));
 const before=(await db.query('select * from ws_ledger order by vote_id')).rows;
 for(let i=0;i<2;i++)await db.exec(await file('migrations/20261103223000_prediction_history.sql'));
 assert.deepEqual(await history(),h);assert.deepEqual((await db.query('select * from ws_ledger order by vote_id')).rows,before);
 for(const role of ['anon','authenticated']){await db.exec('set role '+role);await assert.rejects(history(),{code:'42501'});await db.exec('reset role');}
 await db.exec('set role service_role');assert.equal((await history()).entries.length,2);
});

test('Sport leaderboard ranks each sport independently and reflects result corrections', async t => {
  const db = await database();
  t.after(() => db.close());
  const a = (await register(db, 1)).profile.id;
  const b = (await register(db, 2)).profile.id;
  await register(db, 3);

  const ids = {};
  for (const sport of ['football', 'basketball', 'volleyball']) {
    const fixture = await call(db, 'admin_create_friendly', {
      p_sport: sport, p_home_name: 'Home', p_away_name: 'Away',
      ...(sport === 'volleyball' ? {p_best_of: 3} : {}),
    });
    ids[sport] = fixture;
    const homeWins = sport !== 'basketball';
    await call(db, 'student_vote', {p_fixture_id: fixture, p_student_id: a, p_choice: 'win_home'});
    await call(db, 'student_vote', {p_fixture_id: fixture, p_student_id: b, p_choice: 'win_away'});
    await call(db, 'admin_start', {p_fixture_id: fixture});
    if (sport === 'volleyball') {
      await call(db, 'admin_record_result', {p_fixture_id: fixture, p_home_sets: 2, p_away_sets: 0});
    } else {
      await call(db, 'admin_score', {p_fixture_id: fixture, p_side: homeWins ? 'home' : 'away', p_increment: 1});
      await call(db, 'admin_end', {p_fixture_id: fixture});
    }
  }

  const read = sport => call(db, 'student_sport_leaderboard', {p_student_id: a, p_sport: sport});
  for (const [sport, expected] of [['football', 50], ['basketball', -25], ['volleyball', 50]]) {
    const rows = await read(sport);
    const me = rows.find(row => row.is_me);
    assert.equal(me.ws, expected);
    assert.equal(me.rank, expected > 0 ? 1 : 3);
    assert.equal(me.predictions, 1);
    assert.equal(me.correct, expected > 0 ? 1 : 0);
    assert.ok(rows.every(row => !('student_id' in row) && !('matric_number' in row)));
  }
  const all = await call(db, 'student_leaderboard', {p_student_id: a});
  assert.equal(all.find(row => row.is_me).ws, 75);
  await call(db, 'admin_correct_result', {p_fixture_id: ids.football, p_home: 0, p_away: 1});
  await db.exec(await file('migrations/20261104150000_prediction_sport_leaderboard.sql'));
  assert.equal((await read('football')).find(row => row.is_me).ws, -25);
  assert.equal((await read('volleyball')).find(row => row.is_me).ws, 50);

  await db.exec('set role authenticated');
  await assert.rejects(read('football'), {code: '42501'});
  await db.exec('set role service_role');
  assert.equal((await read('basketball')).find(row => row.is_me).ws, -25);
});
