import {getStudentOverview} from '@/lib/studentData';
import {selectFixtures,sportsSearchOptions} from '@/lib/fixtures';
import SportsSearch from '@/components/shared/SportsSearch';
import FixtureList from '@/components/shared/FixtureList';
import Refresh from '@/components/shared/Refresh';
export const metadata={title:'Fixtures'};
export default async function Fixtures({searchParams}){
 const {data:d}=await getStudentOverview(),{fixtures,leagues,...selection}=selectFixtures(d,await searchParams);
 return <><Refresh/><div className="page-heading"><h1>Fixtures</h1></div>
  <SportsSearch key={JSON.stringify(selection)} selection={selection} leagues={d.leagues} options={sportsSearchOptions(d)}/>
  <section className="section"><div className="section-header"><h2>Match schedule</h2><span className="help">{fixtures.length} fixtures / WAT</span></div><FixtureList fixtures={fixtures} teams={d.teams} leagues={d.leagues} polls={d.my_polls} myTeamIds={d.my_team_ids}/></section>
 </>;
}
