import Link from 'next/link';
import MatchBoard from './MatchBoard';
import {sideTeam} from '@/lib/sports';
export default function FixtureCard({fixture,teams,leagues=[],mine=false,admin=false,children}){
 const home=sideTeam(fixture,teams,'home'),away=sideTeam(fixture,teams,'away');
 return <article className={`fixture-item${mine?' my-team-row':''}`}>
  <Link className="fixture-card-link" href={`/${admin?'fixtures':'matches'}/${fixture.id}`} aria-label={`View ${home.name} vs ${away.name}`}/>
  <MatchBoard fixture={fixture} teams={teams} leagues={leagues} clickable={false} showActions={!admin}/>
  {mine&&<p className="help">Your team</p>}{children}
  {admin&&<div className="fixture-control-link"><Link href={`/fixtures/${fixture.id}`} className="quiet-link">Open match controls</Link></div>}
 </article>;
}
