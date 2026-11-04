import EmptyState from './EmptyState';
import FixtureCard from './FixtureCard';
export default function FixtureList({fixtures,teams,leagues=[],myTeamIds=[],admin=false}){
 if(!fixtures.length)return <EmptyState title="No fixtures here yet">Matches will appear as the schedule is prepared.</EmptyState>;
 return <div className="fixture-stack">{fixtures.map(f=><FixtureCard key={f.id} fixture={f} teams={teams} leagues={leagues} admin={admin} mine={myTeamIds.includes(f.home_team_id)||myTeamIds.includes(f.away_team_id)}/>)}</div>;
}
