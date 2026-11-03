import Link from 'next/link';
import {getStudentOverview} from '@/lib/studentData';
import {SPORT_NAMES} from '@/lib/constants';
import {selectLeagueTables,sportsSearchOptions} from '@/lib/fixtures';
import SportsSearch from '@/components/shared/SportsSearch';
import StandingsPreview from '@/components/shared/StandingsPreview';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
import LeagueMark from '@/components/shared/LeagueMark';
export const metadata={title:'Standings'};
export default async function Standings({searchParams}){
 const {data:d}=await getStudentOverview(),{leagues,...selection}=selectLeagueTables(d,await searchParams);
 return <><Refresh/><div className="page-heading"><h1>Standings</h1></div>
  <SportsSearch key={JSON.stringify(selection)} selection={selection} leagues={d.leagues} options={sportsSearchOptions(d,{tables:true})} action="/student/standings" mode="tables"/>
  {leagues.length?leagues.map(l=><section className="section" key={l.id}><div className="section-header"><div className="league-heading"><LeagueMark league={l}/><div><h2>{l.name}</h2><p className="help">{SPORT_NAMES[l.sport]} / {l.season}</p></div></div><Link className="quiet-link" href={`/student/fixtures?league=${l.id}`}>View fixtures</Link></div><StandingsPreview league={l} standings={d.standings.filter(r=>r.league_id===l.id)} myTeamIds={d.my_team_ids}/></section>):<EmptyState title="No matching active leagues">Search for another team or league.</EmptyState>}
 </>;
}
