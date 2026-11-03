import {getStudentOverview} from '@/lib/studentData';
import {selectFixtures,sportsSearchOptions} from '@/lib/fixtures';
import SportsSearch from '@/components/shared/SportsSearch';
import MatchBoard from '@/components/shared/MatchBoard';
import Refresh from '@/components/shared/Refresh';
import EmptyState from '@/components/shared/EmptyState';
export const metadata={title:'Live matches'};
export default async function Live({searchParams}){
 const {data:d}=await getStudentOverview(),{fixtures,leagues,...selection}=selectFixtures(d,await searchParams);
 const live=fixtures.filter(f=>f.status==='live'),recent=fixtures.filter(f=>['completed','walkover','cancelled'].includes(f.status)).slice(0,6);
 const match=f=><article className="live-match section" key={f.id}><MatchBoard fixture={f} teams={d.teams} leagues={d.leagues} featured={f.status==='live'}/></article>;
 return <><Refresh/><div className="page-heading"><h1>Live matches</h1></div>
  <SportsSearch key={JSON.stringify(selection)} selection={selection} leagues={d.leagues} options={sportsSearchOptions(d)} action="/student/live" mode="live"/>
  <section className="section"><h2>On the field</h2>{live.length?live.map(match):<EmptyState title="No matching live matches">Find the next match on Fixtures.</EmptyState>}</section>
  <section className="section"><h2>Final whistle</h2>{recent.length?recent.map(match):<EmptyState title="No matching results">Final results appear here.</EmptyState>}</section>
 </>;
}
