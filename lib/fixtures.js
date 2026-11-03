import {SPORTS} from './constants.js';
import {fixtureTime} from './sports.js';
export const searchKey=value=>String(value||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
export const searchMatches=(value,query)=>searchKey(value).includes(searchKey(query));
const text=value=>typeof value==='string'?value.trim().slice(0,120):'';
function searchSelection(data,query){
 const q=text(query.q),team=data.teams?.some(t=>t.id===query.team)?query.team:'';
 const team_name=text(query.team_name);
 return {q,team,team_name};
}
export function fixtureMatchesSearch(f,data,selection){
 const {q,team,team_name}=selection;
 const home=data.teams?.find(t=>t.id===f.home_team_id)?.name||f.home_name;
 const away=data.teams?.find(t=>t.id===f.away_team_id)?.name||f.away_name;
 return (!team||[f.home_team_id,f.away_team_id].includes(team))&&
  (!team_name||[home,away].some(n=>searchKey(n)===searchKey(team_name)))&&
  (!q||[home,away,data.leagues.find(l=>l.id===f.league_id)?.name||'Friendly'].some(n=>searchMatches(n,q)));
}
export function sportsSearchOptions(data,{tables=false}={}){
 const leagues=data.leagues.map(l=>({key:`league:${l.id}`,name:l.name,sport:l.sport,kind:'League',league:l.id,logo_path:l.logo_path}));
 const teams=(data.teams||[]).filter(t=>!tables||data.standings?.some(r=>r.team_id===t.id)).map(t=>({key:`team:${t.id}`,name:t.name,sport:t.sport,kind:'Team',team:t.id}));
 const named=[];
 if(!tables)for(const f of data.fixtures)for(const side of ['home','away']){
  if(f[`${side}_team_id`])continue;
  const name=f[`${side}_name`],key=`named:${f.sport}:${searchKey(name)}`;
  if(name&&!named.some(t=>t.key===key))named.push({key,name,sport:f.sport,kind:'Team',team_name:name});
 }
 return [...leagues,...teams,...named].sort((a,b)=>a.name.localeCompare(b.name)||a.key.localeCompare(b.key));
}
export function selectFixtures(data, query={}) {
  const sport = SPORTS.includes(query.sport) ? query.sport : '';
  const type = ['league','friendly'].includes(query.type) ? query.type : '';
  const leagues = data.leagues.filter(l => !sport || l.sport===sport);
  const league = leagues.some(l => l.id===query.league) ? query.league : '';
  const statuses=['scheduled','unscheduled','live','completed','walkover','cancelled'];
  const status=statuses.includes(query.status)?query.status:'';
  const search=searchSelection(data,query);
  const group=f=>f.status==='scheduled'&&!f.scheduled_at?'unscheduled':f.status;
  const order=f=>({live:0,scheduled:1,unscheduled:2,completed:3,walkover:3,cancelled:3})[group(f)];
  const fixtures=data.fixtures.filter(f=>(!sport||f.sport===sport)&&(!league||f.league_id===league)&&(!type||(type==='friendly'?!f.league_id:!!f.league_id))&&(!status||group(f)===status)&&fixtureMatchesSearch(f,data,search))
    .sort((a,b)=>order(a)-order(b)||(order(a)===3?fixtureTime(b)-fixtureTime(a):fixtureTime(a)-fixtureTime(b))||a.id.localeCompare(b.id));
  return {sport,type,league,status,...search,leagues,fixtures};
}
export function selectLeagueTables(data,query={}){
 const sport=SPORTS.includes(query.sport)?query.sport:'';
 const available=data.leagues.filter(l=>!sport||l.sport===sport);
 const league=available.some(l=>l.id===query.league)?query.league:'';
 const search=searchSelection(data,query);
 const leagues=available.filter(l=>{
  const rows=data.standings.filter(r=>r.league_id===l.id);
  return (!league||l.id===league)&&(!search.team||rows.some(r=>r.team_id===search.team))&&
   (!search.team_name||rows.some(r=>searchKey(r.name)===searchKey(search.team_name)))&&
   (!search.q||[l.name,...rows.map(r=>r.name)].some(n=>searchMatches(n,search.q)));
 });
 return {sport,league,...search,leagues};
}
