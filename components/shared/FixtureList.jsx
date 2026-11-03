import Link from "next/link";
import EmptyState from "./EmptyState";
import MatchBoard from "./MatchBoard";
export default function FixtureList({fixtures, teams, leagues = [], polls = [], myTeamIds = [], admin = false, predictions = false}) {
  if (!fixtures.length) return <EmptyState title="No fixtures here yet">Matches will appear as the schedule is prepared.</EmptyState>;
  return <div className="fixture-stack">{fixtures.map(f => {
    const mine = myTeamIds.includes(f.home_team_id) || myTeamIds.includes(f.away_team_id);
    return <article className={`fixture-item${mine ? ' my-team-row' : ''}`} key={f.id}>
      <MatchBoard fixture={f} teams={teams} leagues={leagues} linked={admin}/>
      {mine && <p className="help">Your team</p>}
      {admin && <div className="fixture-control-link"><Link href={`/fixtures/${f.id}`} className="quiet-link">Open match controls</Link></div>}
    </article>;
  })}</div>;
}
