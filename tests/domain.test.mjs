import test from 'node:test';import assert from 'node:assert/strict';
import {selectFixtures} from '../lib/fixtures.js';
import {fixtureScore,sideTeam,outcome,SET_SCORES} from '../lib/sports.js';
import {signupDetails,matchReturnPath,matchHref} from '../lib/account.js';
test('New fixture presentation supports typed clubs, Volleyball results and void matches',()=>{
 const f={home_name:'Typed Home',away_name:'Typed Away',home_initials:'TH',away_initials:'TA',sport:'volleyball',status:'live',best_of:3};
 assert.equal(sideTeam(f,[],'home').name,'Typed Home');assert.equal(fixtureScore(f),'In play');
 assert.equal(fixtureScore({...f,ended_at:'2026-11-01'}),'Result pending');assert.equal(fixtureScore({...f,status:'completed',home_sets:2,away_sets:1}),'2 : 1 sets');
 assert.match(outcome({...f,status:'cancelled'},[]),/Ws are unchanged/);assert.match(outcome({...f,status:'walkover',winner_side:'away'},[]),/Typed Away won/);
 assert.deepEqual(SET_SCORES(3),['2-0','0-2','2-1','1-2']);assert.equal(SET_SCORES(5).length,6);
});
test('Filters preserve Friendly, league and status boundaries and ignore invalid queries',()=>{
 const data={leagues:[{id:'l',sport:'football'}],fixtures:[{id:'f1',sport:'football',league_id:'l',status:'scheduled',created_at:'2026-11-01T00:00:00Z'},{id:'f2',sport:'basketball',league_id:null,status:'live',created_at:'2026-11-01T00:00:00Z'},{id:'f3',sport:'football',league_id:'l',status:'cancelled',ended_at:'2026-11-02T00:00:00Z'}]};
 assert.equal(selectFixtures(data,{type:'friendly'}).fixtures[0].id,'f2');assert.equal(selectFixtures(data,{status:'unscheduled'}).fixtures[0].id,'f1');
 assert.equal(selectFixtures(data,{sport:'basketball',league:'l'}).league,'');assert.equal(selectFixtures(data,{status:'cancelled'}).fixtures[0].id,'f3');
 assert.equal(selectFixtures(data,{sport:['football'],type:'invalid'}).fixtures.length,3);
});
test('Campus-only account validation rejects suffix tricks and false faculties',()=>{
 const body={email:' tfu123@topfaith.edu.ng ',name:' Student ',faculty:'COMPASS',password:'12345678'};
 assert.equal(signupDetails(body).email,'tfu123@topfaith.edu.ng');assert.equal(signupDetails(body).name,'Student');
 for(const email of ['outside@example.com','a@topfaith.edu.ng.example.com','a@@topfaith.edu.ng'])assert.throws(()=>signupDetails({...body,email}));
 assert.throws(()=>signupDetails({...body,faculty:'Unknown'}));
});

test('Post-login fixture destinations reject external URLs and preserve the selected tab',()=>{
 const id='7a0d3d71-6d43-45e2-b5a7-a208f1713321';
 assert.equal(matchReturnPath(matchHref(id,'squad')),`/matches/${id}?tab=squad`);
 assert.equal(matchReturnPath(`/matches/${id}`),`/matches/${id}`);
 for(const value of ['//evil.example','https://evil.example','/matches/../../evil','/student','/matches/not-a-uuid',`/matches/${id}?next=https://evil.example`,`/matches/${id}?tab=squad#outside`,['/matches/'+id],null])assert.equal(matchReturnPath(value),'');
});
