import {SPORTS} from './constants.js';
import {fixtureTime} from './sports.js';
export function selectFixtures(data, query={}) {
  const sport = SPORTS.includes(query.sport) ? query.sport : '';
  const type = ['league','friendly'].includes(query.type) ? query.type : '';
  const leagues = data.leagues.filter(l => !sport || l.sport===sport);
  const league = leagues.some(l => l.id===query.league) ? query.league : '';
  const statuses=['scheduled','unscheduled','live','completed','walkover','cancelled'];
  const status=statuses.includes(query.status)?query.status:'';
  const group=f=>f.status==='scheduled'&&!f.scheduled_at?'unscheduled':f.status;
  const order=f=>({live:0,scheduled:1,unscheduled:2,completed:3,walkover:3,cancelled:3})[group(f)];
  const fixtures=data.fixtures.filter(f=>(!sport||f.sport===sport)&&(!league||f.league_id===league)&&(!type||(type==='friendly'?!f.league_id:!!f.league_id))&&(!status||group(f)===status))
    .sort((a,b)=>order(a)-order(b)||(order(a)===3?fixtureTime(b)-fixtureTime(a):fixtureTime(a)-fixtureTime(b))||a.id.localeCompare(b.id));
  return {sport,type,league,status,leagues,fixtures};
}
