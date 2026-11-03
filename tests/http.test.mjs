import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {createWriteStream} from 'node:fs';
import {readFile as read} from 'node:fs/promises';
import {setTimeout as pause} from 'node:timers/promises';

const base=(process.env.WHISTLE_TEST_BASE_URL||'http://127.0.0.1:3100').replace(/\/$/,'');
const cookie=r=>r.headers.getSetCookie().map(h=>h.split(';')[0]).join('; ');
test('Full rebuilt app: HTTP routes, SQL integration and access boundaries',{timeout:420000},async t=>{
 let server;
 if(!process.env.WHISTLE_TEST_BASE_URL){
  const env={...process.env,WHISTLE_TEST_SERVICE:'1',NEXT_PUBLIC_WHISTLE_DEMO:'1',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:4318',NEXT_PUBLIC_SUPABASE_ANON_KEY:'whistle-local-anon',SUPABASE_SERVICE_ROLE_KEY:'whistle-local-service',NEXT_TELEMETRY_DISABLED:'1'};
  const log=createWriteStream('tests-http.log');
  server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--port','3100','--hostname','127.0.0.1'],{env,stdio:['ignore','pipe','pipe'],detached:process.platform!=='win32'});
  server.stdout.pipe(log);server.stderr.pipe(log);
 }
 const request=(path,{body,method=body?'POST':'GET',session='',origin=base,...rest}={})=>fetch(base+path,{method,redirect:'manual',signal:AbortSignal.timeout(30000),headers:{Origin:origin,Cookie:session,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),...rest});
 const value=async(path,opts={})=>{const r=await request(path,opts);const b=await r.json();assert.equal(r.status,200,JSON.stringify(b));return b;};
 const login=async(email)=>{const r=await request('/api/auth/login',{body:{email,password:'demo-whistle-2026'}});assert.equal(r.status,200,await r.clone().text());return cookie(r);};
 let admin,student,other,profile,otherProfile,teamIds=[],leagueId,match;
 const tag=Date.now().toString(36),email=`acceptance.${tag}@topfaith.edu.ng`;
 try{
  let ready=false;for(let i=0;i<90;i++){try{const r=await request('/login',{signal:AbortSignal.timeout(5000)});if(r.status===200&&(await r.text()).includes('name="email"')){ready=true;break;}}catch{}await pause(500);}assert.ok(ready,'Login page ready');
  await t.test('Guests must sign in for Whistle content; auth pages use System without theme controls',async()=>{
   for(const path of ['/','/student','/dashboard',`/matches/${randomUUID()}?tab=squad`]){
    const r=await request(path);assert.equal(r.status,307,path);assert.equal(new URL(r.headers.get('location')).pathname,'/login');
    const html=await r.text();assert.ok(!html.includes('Demo Titans'));assert.ok(!html.includes('Demo Student'));
   }
   const poll=await request(`/api/polls/${randomUUID()}`);assert.equal(poll.status,401);assert.ok(!(await poll.text()).includes('tally'));
   for(const path of ['/login','/signup']){const r=await request(path);assert.equal(r.status,200);const html=await r.text();assert.ok(!html.includes('Switch to dark theme'));assert.ok(!html.includes('Switch to light theme'));assert.ok(!html.includes('class="auth-theme"'));}
   for(const path of ['/events','/api/events','/api/registrations'])assert.equal((await request(path)).status,404,path);
   const manifest=await (await request('/manifest.json')).json();assert.equal(manifest.name,'Whistle');
  });
  await t.test('Sign-in, campus restriction, HTTP-only cookies and admin-only API',async()=>{
   assert.equal((await request('/api/admin-data')).status,401);assert.equal((await request('/dashboard')).status,307);
   assert.equal((await request('/api/auth/login',{body:{email:'outside@example.com',password:'12345678'}})).status,400);
   assert.equal((await request('/api/auth/login',{body:{email:'admin-test@topfaith.edu.ng',password:'demo-whistle-2026'},origin:'https://wrong.example'})).status,403);
   const r=await request('/api/auth/login',{body:{email:'admin-test@topfaith.edu.ng',password:'demo-whistle-2026'}});assert.equal(r.status,200);assert.ok(r.headers.getSetCookie().some(h=>/HttpOnly/i.test(h)));admin=cookie(r);
   const page=await (await request('/dashboard',{session:admin})).text();assert.match(page,/Create Friendly/);assert.ok(!page.includes('Pending payments'));
  });
  await t.test('Signup confirmation, faculty/matric parsing and role isolation',async()=>{
   await value('/api/auth/signup',{body:{email,name:'Acceptance Student',faculty:'Engineering',password:'demo-whistle-2026',is_admin:true}});
   assert.equal((await request('/api/auth/login',{body:{email,password:'demo-whistle-2026'}})).status,401);
   let data=await value('/api/admin-data',{session:admin});assert.ok(!data.students.some(s=>s.email===email));
   const r=await request('/auth/confirm?type=email&token_hash='+encodeURIComponent(email));assert.equal(r.status,303);assert.ok(r.headers.get('location').endsWith('/student'));student=cookie(r);
   data=await value('/api/admin-data',{session:admin});profile=data.students.find(s=>s.email===email);assert.ok(profile);assert.equal(profile.is_admin,false);assert.equal(profile.matric_number,email.split('@')[0]);
   assert.equal((await request('/api/admin-data',{session:student})).status,401);assert.equal((await request('/dashboard',{session:student})).status,307);
   assert.equal((await request('/student/events',{session:student})).status,404,'removed student Events page');
   other=await login('student2@topfaith.edu.ng');otherProfile=data.students.find(s=>s.email==='student2@topfaith.edu.ng');
  });
  await t.test('Team creation requires actual roster members; home/away generation and roster conflicts',async()=>{
   assert.equal((await request('/api/teams',{session:admin,body:{name:'Empty '+tag,sport:'football',student_ids:[]}})).status,409);
   const data=await value('/api/admin-data',{session:admin}),people=[profile.id,...data.students.filter(s=>!s.is_admin&&s.id!==profile.id).slice(0,3).map(s=>s.id)];
   for(let i=0;i<4;i++)teamIds.push((await value('/api/teams',{session:admin,body:{name:`HTTP ${tag} ${i}`,sport:'football',student_ids:[people[i]]}})).id);
   leagueId=(await value('/api/leagues',{session:admin,body:{name:'HTTP League '+tag,sport:'football',season:'Acceptance',team_ids:teamIds.slice(0,3)}})).id;
   let d=await value('/api/admin-data',{session:admin});assert.equal(d.fixtures.filter(f=>f.league_id===leagueId).length,6);
   await value(`/api/leagues/${leagueId}/teams`,{session:admin,body:{team_id:teamIds[3]}});d=await value('/api/admin-data',{session:admin});assert.equal(d.fixtures.filter(f=>f.league_id===leagueId).length,12);
   const conflict=(await value('/api/teams',{session:admin,body:{name:'Conflict '+tag,sport:'football',student_ids:[profile.id]}})).id;
   assert.equal((await request(`/api/leagues/${leagueId}/teams`,{session:admin,body:{team_id:conflict}})).status,409);
   assert.equal((await request('/api/teams',{session:student,body:{name:'Blocked',sport:'football',student_ids:[profile.id]}})).status,401);
   assert.equal((await request('/api/teams',{session:admin,origin:'https://wrong.example',body:{name:'Blocked'}})).status,403);
  });
  await t.test('Logo upload, actual-byte validation, readback and initials fallback',async()=>{
   const image=await read(new URL('./fixtures/logo.png',import.meta.url));
   const upload=async(bytes,type='image/png')=>{
    const prep=await value('/api/logos/upload',{session:admin,body:{entity:'teams',id:teamIds[0],type,size:bytes.length}});
    const form=new FormData();form.append('',new Blob([bytes],{type}),'logo.png');
    const r=await fetch(`${base}/__test_supabase/storage/v1/object/upload/sign/team-logos/${prep.path}?token=${prep.token}`,{method:'PUT',body:form});assert.equal(r.status,200,await r.text());return prep;
   };
   const prep=await upload(image);await value('/api/logos',{session:admin,body:{entity:'teams',id:teamIds[0],path:prep.path}});
   let d=await value('/api/admin-data',{session:admin});assert.equal(d.teams.find(t=>t.id===teamIds[0]).logo_path,prep.path);
   assert.equal((await request(`/__test_supabase/storage/v1/object/public/team-logos/${prep.path}`)).status,200);
   const invalid=await upload(Buffer.from('<svg>not a PNG</svg>'));assert.equal((await request('/api/logos',{session:admin,body:{entity:'teams',id:teamIds[0],path:invalid.path}})).status,400);
   assert.equal((await request('/api/logos/upload',{session:student,body:{entity:'teams',id:teamIds[0],type:'image/png',size:10}})).status,401);
   assert.equal((await request('/api/logos/upload',{session:admin,body:{entity:'teams',id:teamIds[0],type:'image/svg+xml',size:10}})).status,400);
   assert.equal((await request('/api/logos/upload',{session:admin,body:{entity:'teams',id:teamIds[0],type:'image/png',size:2097153}})).status,400);
   await value('/api/logos',{session:admin,method:'DELETE',body:{entity:'teams',id:teamIds[0]}});d=await value('/api/admin-data',{session:admin});assert.equal(d.teams.find(t=>t.id===teamIds[0]).logo_path,null);
  });
  await t.test('Draft fixture editing, immediate polls and deletion of unstarted voted fixtures',async()=>{
   const id=(await value('/api/fixtures',{session:admin,body:{league_id:leagueId,home_team_id:teamIds[0],away_team_id:teamIds[1]}})).id;
   let p=(await value(`/api/polls/${id}`,{session:student})).poll;assert.equal(p.status,'open');
   await value(`/api/polls/${id}/vote`,{session:student,body:{choice:'win_home',student_id:otherProfile.id}});
   p=(await value(`/api/polls/${id}`,{session:student})).poll;assert.equal(p.my_choice,'win_home');assert.equal(p.total,1);
   await value(`/api/fixtures/${id}/reschedule`,{session:admin,body:{scheduled_at:'2020-01-01T15:00:00+01:00',venue:'Acceptance pitch'}});
   let d=await value('/api/admin-data',{session:admin});assert.equal(d.fixtures.find(f=>f.id===id).status,'scheduled','past date does not start a match');
   await value(`/api/fixtures/${id}`,{session:admin,method:'DELETE',body:{}});d=await value('/api/admin-data',{session:admin});assert.ok(!d.fixtures.some(f=>f.id===id));
   assert.equal(d.fixtures.filter(f=>f.league_id===leagueId).length,12);
  });
  await t.test('Typed Friendly, optional permanent save and registered-player requirement',async()=>{
   match=(await value('/api/friendlies',{session:admin,body:{sport:'football',home_name:'Visitors '+tag,away_name:'Guests '+tag}})).id;
   const d=await value('/api/admin-data',{session:admin}),f=d.fixtures.find(f=>f.id===match);assert.equal(f.league_id,null);assert.equal(f.home_team_id,null);assert.equal(f.away_team_id,null);
   assert.equal((await value(`/api/polls/${match}`,{session:student})).poll.can_vote,true);
   assert.equal((await request('/api/friendlies',{session:admin,body:{sport:'football',home_name:'Save '+tag,away_name:'Other',save_home:true}})).status,409);
   const saved=(await value('/api/friendlies',{session:admin,body:{sport:'football',home_name:'Save '+tag,away_name:'Other',save_home:true,home_student_ids:[profile.id]}})).id;
   assert.ok((await value('/api/admin-data',{session:admin})).fixtures.find(f=>f.id===saved).home_team_id);
  });
  await t.test('Prediction replacement, manual Start, draws, Ws settlement, negative balances and correction',async()=>{
   const before=(await value('/api/leaderboard',{session:other})).find(r=>r.is_me).ws;
   await value(`/api/polls/${match}/vote`,{session:student,body:{choice:'win_home'}});await value(`/api/polls/${match}/vote`,{session:student,body:{choice:'draw'}});await value(`/api/polls/${match}/vote`,{session:other,body:{choice:'win_away'}});
   assert.equal((await value(`/api/polls/${match}`,{session:student})).poll.total,2);
   await value(`/api/fixtures/${match}/start`,{session:admin,body:{}});
   assert.equal((await value(`/api/polls/${match}`,{session:student})).poll.status,'closed');
   assert.equal((await request(`/api/polls/${match}/vote`,{session:student,body:{choice:'win_home'}})).status,409);
   assert.equal((await request(`/api/fixtures/${match}`,{session:admin,method:'DELETE',body:{}})).status,409);
   await value(`/api/fixtures/${match}/end`,{session:admin,body:{}});
   assert.equal((await value('/api/leaderboard',{session:student})).find(r=>r.is_me).ws,50);
   assert.equal((await value('/api/leaderboard',{session:other})).find(r=>r.is_me).ws,before-25);
   await value(`/api/fixtures/${match}/correct-result`,{session:admin,body:{home:1,away:2}});
   assert.equal((await value('/api/leaderboard',{session:student})).find(r=>r.is_me).ws,-25);
   assert.equal((await value('/api/leaderboard',{session:other})).find(r=>r.is_me).ws,before+50);
   await value(`/api/fixtures/${match}/correct-result`,{session:admin,body:{home:1,away:2}});assert.equal((await value('/api/leaderboard',{session:student})).find(r=>r.is_me).ws,-25);
   assert.equal((await request(`/api/fixtures/${match}/end`,{session:admin,body:{}})).status,409);
   const page=await (await request('/student/leaderboard',{session:student})).text();assert.match(page,/Acceptance Student/);assert.match(page,/-25 Ws/);
  });
  await t.test('Volleyball best-of-five, no Draw choice, final-only Ws and rejected null/wrong sets',async()=>{
   const id=(await value('/api/friendlies',{session:admin,body:{sport:'volleyball',best_of:5,home_name:'Five Home '+tag,away_name:'Five Away '+tag}})).id;
   assert.equal((await request(`/api/polls/${id}/vote`,{session:student,body:{choice:'draw'}})).status,409);
   await value(`/api/polls/${id}/vote`,{session:student,body:{choice:'win_home'}});await value(`/api/fixtures/${id}/start`,{session:admin,body:{}});
   assert.equal((await request(`/api/fixtures/${id}/score`,{session:admin,body:{side:'home',increment:1}})).status,409);
   assert.equal((await value(`/api/fixtures/${id}/end`,{session:admin,body:{}})).needs_result,true);
   assert.equal((await value(`/api/polls/${id}`,{session:student})).poll.my_ws,null);
   assert.equal((await request(`/api/fixtures/${id}/record-result`,{session:admin,body:{home_sets:null,away_sets:null}})).status,400);
   assert.equal((await request(`/api/fixtures/${id}/record-result`,{session:admin,body:{home_sets:2,away_sets:1}})).status,409);
   await value(`/api/fixtures/${id}/record-result`,{session:admin,body:{home_sets:3,away_sets:1}});assert.equal((await value(`/api/polls/${id}`,{session:student})).poll.my_ws,50);
  });
  await t.test('Cancellation and walkovers retain history, void predictions and leave Ws unchanged',async()=>{
   const before=(await value('/api/leaderboard',{session:student})).find(r=>r.is_me).ws;
   for(const action of ['cancel','walkover']){
    const id=(await value('/api/friendlies',{session:admin,body:{sport:'basketball',home_name:`${action} Home ${tag}`,away_name:`${action} Away ${tag}`}})).id;
    await value(`/api/polls/${id}/vote`,{session:student,body:{choice:'draw'}});await value(`/api/fixtures/${id}/start`,{session:admin,body:{}});
    await value(`/api/fixtures/${id}/${action}`,{session:admin,body:action==='cancel'?{reason:'Abandoned in acceptance test'}:{winner:'away'}});
    assert.equal((await value(`/api/polls/${id}`,{session:student})).poll.status,'void');assert.equal((await request(`/api/fixtures/${id}`,{session:admin,method:'DELETE',body:{}})).status,409);
   }
   assert.equal((await value('/api/leaderboard',{session:student})).find(r=>r.is_me).ws,before);
  });
  await t.test('Student pages, preferences, feedback review and profile privacy are fully connected',async()=>{
   for(const path of ['/student','/student/fixtures','/student/standings','/student/live','/student/leaderboard','/student/notifications','/student/feedback','/student/profile']){
    const r=await request(path,{session:student});assert.equal(r.status,200,path);const html=await r.text();assert.ok(!html.includes('Pending payments'));assert.ok(!html.includes('Create Fest'));assert.ok(!html.includes('admin-test@topfaith.edu.ng'));
   }
   await value('/api/notifications/preferences',{session:student,method:'PATCH',body:{notifications_enabled:false}});assert.equal((await value('/api/notifications',{session:student})).notifications_enabled,false);
   await value('/api/notifications/preferences',{session:student,method:'PATCH',body:{notifications_enabled:true}});
   const id=randomUUID();await value('/api/feedback',{session:student,body:{id,category:'bug',message:'Acceptance feedback',student_id:otherProfile.id,status:'resolved'}});
   let d=await value('/api/admin-data',{session:admin});assert.equal(d.feedback.find(f=>f.id===id).student_id,profile.id);assert.equal(d.feedback.find(f=>f.id===id).status,'new');
   await value(`/api/feedback/${id}`,{session:admin,method:'PATCH',body:{status:'resolved'}});
   await value('/api/feedback',{session:student,body:{id,category:'bug',message:'Acceptance feedback'}});d=await value('/api/admin-data',{session:admin});assert.equal(d.feedback.find(f=>f.id===id).status,'resolved');
   assert.equal((await request(`/api/feedback/${id}`,{session:student,method:'PATCH',body:{status:'resolved'}})).status,401);
  });
  await t.test('Optional player details validate identities, save at End, render publicly and reject unauthorized or late edits',async()=>{
   const id=(await value('/api/friendlies',{session:admin,body:{sport:'football',home_team_id:teamIds[0],away_team_id:teamIds[1]}})).id;
   const d=await value('/api/admin-data',{session:admin});
   const player=d.team_players.find(p=>p.team_id===teamIds[0]).student_id;
   const expectedName=d.students.find(s=>s.id===player).name;
   const details={man_of_the_match:{side:'home',student_id:player,name:'Forged'},goals:[{side:'home',scorer:{side:'home',student_id:player},assist:null}]};
   const body={player_details:details};
   assert.equal((await request(`/api/fixtures/${id}/players`,{session:admin,body:{}})).status,400);
   assert.equal((await request(`/api/fixtures/${id}/end`,{session:admin,body:{player_details:null}})).status,400);
   assert.equal((await request(`/api/fixtures/${id}/players`,{body})).status,401);
   assert.equal((await request(`/api/fixtures/${id}/players`,{session:student,body})).status,401);
   assert.equal((await request(`/api/fixtures/${id}/players`,{session:admin,origin:'https://wrong.example',body})).status,403);
   assert.equal((await request(`/api/fixtures/${id}/players`,{session:admin,body})).status,409);
   await value(`/api/fixtures/${id}/start`,{session:admin,body:{}});
   assert.equal((await request(`/api/fixtures/${id}/end`,{session:admin,body})).status,409);
   assert.equal((await value('/api/admin-data',{session:admin})).fixtures.find(f=>f.id===id).status,'live');
   await value(`/api/fixtures/${id}/score`,{session:admin,body:{side:'home',increment:1}});
   const wrong={player_details:{...details,man_of_the_match:{side:'away',student_id:player}}};
   assert.equal((await request(`/api/fixtures/${id}/players`,{session:admin,body:wrong})).status,409);
   await value(`/api/fixtures/${id}/players`,{session:admin,body});
   let page=await (await request(`/fixtures/${id}`,{session:admin})).text();
   assert.match(page,/Save player details/);assert.match(page,/Goalscorer/);
   await value(`/api/fixtures/${id}/end`,{session:admin,body:{player_details:{...details,man_of_the_match:null}}});
   const f=(await value('/api/admin-data',{session:admin})).fixtures.find(f=>f.id===id);
   assert.equal(f.player_details.man_of_the_match,null);assert.equal(f.player_details.goals[0].scorer.name,expectedName);
   assert.equal((await request(`/api/fixtures/${id}/players`,{session:admin,body})).status,409);
   page=await (await request(`/fixtures/${id}`,{session:admin})).text();assert.ok(!page.includes('Save player details'));
   page=await (await request(`/matches/${id}`,{session:student})).text();assert.match(page,new RegExp(expectedName));
   const volley=(await value('/api/friendlies',{session:admin,body:{sport:'volleyball',best_of:3,home_name:'Award Home '+tag,away_name:'Award Away '+tag}})).id;
   await value(`/api/fixtures/${volley}/start`,{session:admin,body:{}});
   const award={player_details:{man_of_the_match:{side:'away',name:'Friendly Captain'},goals:[]}};
   await value(`/api/fixtures/${volley}/end`,{session:admin,body:award});
   assert.equal((await request(`/api/fixtures/${volley}/players`,{session:admin,body:award})).status,409);
   await value(`/api/fixtures/${volley}/record-result`,{session:admin,body:{home_sets:2,away_sets:0}});
   page=await (await request(`/matches/${volley}`,{session:student})).text();assert.match(page,/Friendly Captain/);assert.match(page,/Man of the Match/);
  });
  await t.test('Signed-in fixture pages retain squads, tabs and form; guest deep links preserve a safe login return',async()=>{
   const d=await value('/api/admin-data',{session:admin});
   const f=d.fixtures.find(f=>f.league_id===leagueId&&f.status==='scheduled');
   let r=await request(`/matches/${f.id}?tab=squad`);assert.equal(r.status,307);assert.equal(new URL(r.headers.get('location')).searchParams.get('next'),`/matches/${f.id}?tab=squad`);
   r=await request(`/matches/${f.id}?tab=squad`,{session:student});assert.equal(r.status,200);
   let html=await r.text();assert.match(html,/Match information/);assert.match(html,/Squad/);assert.match(html,/Last 5/);assert.ok(!html.includes('Correct +50 Ws'));
   const roster=d.league_players.find(p=>p.league_id===leagueId&&p.team_id===f.home_team_id);
   assert.ok(html.includes(d.students.find(s=>s.id===roster.student_id).name));
   assert.ok(!html.includes('admin-test@topfaith.edu.ng'));assert.ok(!html.includes('Acceptance Student account'));
   const next=`/matches/${f.id}?tab=predictions`;
   r=await request('/api/auth/login',{body:{email:'student2@topfaith.edu.ng',password:'demo-whistle-2026',next}});assert.equal((await r.json()).redirect,next);
   r=await request('/api/auth/login',{body:{email:'student2@topfaith.edu.ng',password:'demo-whistle-2026',next:'//outside.example/path'}});assert.equal((await r.json()).redirect,'/student');
   r=await request(`/login?next=${encodeURIComponent(next)}`,{session:student});assert.equal(r.status,307);assert.ok(r.headers.get('location').endsWith(next));
   assert.equal((await request('/matches/not-a-uuid',{session:student})).status,404);
   assert.equal((await request(`/matches/${randomUUID()}`,{session:student})).status,404);
   const friendly=d.fixtures.find(f=>f.league_id===null&&f.home_team_id===null);
   html=await (await request(`/matches/${friendly.id}?tab=squad`,{session:student})).text();assert.match(html,/Squad not available/);assert.ok(!html.includes('Last 5'));
  });
  await t.test('Signed home contains the campus hero and in-pane More controls; role boundaries remain intact',async()=>{
   let r=await request('/',{session:student});assert.equal(r.status,307);assert.ok(r.headers.get('location').endsWith('/student'));
   r=await request('/',{session:admin});assert.equal(r.status,307);assert.ok(r.headers.get('location').endsWith('/dashboard'));
   const html=await (await request('/student',{session:student})).text();assert.match(html,/Every match\./);assert.match(html,/campus\./);assert.match(html,/More options for/);assert.ok(!html.includes('class="fixture-actions"'));
   const d=await value('/api/admin-data',{session:admin}),f=d.fixtures.find(f=>f.league_id===leagueId);
   assert.equal((await request(`/matches/${f.id}`,{session:admin})).status,200);
   assert.equal((await request(`/api/polls/${f.id}`)).status,401);
   assert.equal((await request(`/api/polls/${f.id}`,{session:admin})).status,200);
   assert.equal((await request('/student',{session:admin})).status,307);
  });
  await t.test('Logout clears the session cookies',async()=>{
   const r=await request('/api/auth/logout',{session:student,method:'POST'});assert.equal(r.status,303);assert.ok(r.headers.getSetCookie().some(h=>/Max-Age=0/.test(h)));
   assert.equal((await request('/',{session:student})).status,307);assert.equal((await request(`/api/polls/${match}`,{session:student})).status,401);
  });
 } finally {
  if(server){if(process.platform==='win32')server.kill();else try{process.kill(-server.pid,'SIGTERM');}catch{}}
 }
});
