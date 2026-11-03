import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getData,getStandings} from '@/lib/data';
import {SPORT_NAMES} from '@/lib/constants';
import Badge from '@/components/shared/Badge';
import Refresh from '@/components/shared/Refresh';
import StandingsPreview from '@/components/shared/StandingsPreview';
import FixtureList from '@/components/shared/FixtureList';
import LeagueTools from '@/components/admin/LeagueTools';
import ArchiveButton from '@/components/admin/ArchiveButton';
import LogoEditor from '@/components/admin/LogoEditor';
import LeagueMark from '@/components/shared/LeagueMark';
export default async function League({params}){
 const {leagueId}=await params,d=await getData(),l=d.leagues.find(l=>l.id===leagueId);if(!l)notFound();
 const ids=d.league_teams.filter(t=>t.league_id===l.id).map(t=>t.team_id),standings=await getStandings(l.id),fixtures=d.fixtures.filter(f=>f.league_id===l.id).sort((a,b)=>(a.round_number||999)-(b.round_number||999)||a.created_at.localeCompare(b.created_at));
 return <><Refresh/><Link className="back-link" href="/leagues">Back to leagues</Link><div className="page-heading"><div className="league-heading"><LeagueMark league={l}/><div><h1>{l.name}</h1><p>{SPORT_NAMES[l.sport]} / {l.season} / {ids.length} teams{l.best_of?` / Best of ${l.best_of}`:''}</p></div></div><Badge status={l.status}/></div><section><h2 className="section-title">Standings</h2><StandingsPreview league={l} standings={standings}/></section>{l.status==='active'&&<><section className="section"><LogoEditor entity="leagues" id={l.id} path={l.logo_path} label="League logo"/></section><LeagueTools league={l} teams={d.teams} enrolledIds={ids}/></>}<section className="section"><div className="section-header"><h2>Fixtures</h2><span className="help">{fixtures.length} matches / Home and away</span></div><FixtureList fixtures={fixtures} teams={d.teams} leagues={d.leagues} admin/></section>{l.status==='active'&&<ArchiveButton entity="leagues" id={l.id} label="League"/>}</>;
}
