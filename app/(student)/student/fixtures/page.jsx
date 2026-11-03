import {getStudentOverview} from '@/lib/studentData';
import {selectFixtures} from '@/lib/fixtures';
import FixtureFilters from '@/components/shared/FixtureFilters';
import FixtureList from '@/components/shared/FixtureList';
import Refresh from '@/components/shared/Refresh';
export const metadata={title:'Fixtures'};
export default async function Fixtures({searchParams}){const {data:d}=await getStudentOverview(),s=selectFixtures(d,await searchParams);return <><Refresh/><div className="page-heading"><div><h1>Fixtures</h1></div></div><FixtureFilters key={`${s.sport}:${s.type}:${s.league}:${s.status}`} selection={s}/><section className="section"><div className="section-header"><h2>Match schedule</h2><span className="help">{s.fixtures.length} fixtures / WAT</span></div><FixtureList fixtures={s.fixtures} teams={d.teams} leagues={d.leagues} polls={d.my_polls} myTeamIds={d.my_team_ids} predictions/></section></>;}
